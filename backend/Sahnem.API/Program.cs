using System.Text;
using System.Text.Json.Serialization;
using System.Threading.RateLimiting;
using FluentValidation;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Sahnem.API.Middleware;
using Sahnem.API.Services;
using Sahnem.Business.AutoMapping;
using Sahnem.Business.Email;
using Sahnem.Business.Interfaces;
using Sahnem.Business.Security;
using Sahnem.Business.Services;
using Sahnem.Business.Storage;
using Sahnem.Business.Validators;
using Sahnem.Business.Validators.User;
using Sahnem.Core.Entities;
using Sahnem.Core.Interfaces;
using Sahnem.DataAccess.Contexts;
using Sahnem.DataAccess.Repositories;
using Scalar.AspNetCore;

// Render'ın container'ında inotify limiti çok düşük olabiliyor; appsettings.json
// için varsayılan FileSystemWatcher tabanlı hot-reload bu limiti doldurup
// uygulamayı açılışta çökertebiliyor ("configured user limit (128) on the
// number of inotify instances has been reached" — canlıda gerçekten yaşandı).
// Config zaten sadece env var + redeploy ile değişiyor, çalışırken dosya
// izlemeye ihtiyacımız yok — bu yüzden WebApplication.CreateBuilder'ın daha
// içeride okuduğu bu bayrağı en baştan kapatıyoruz.
Environment.SetEnvironmentVariable("DOTNET_hostBuilder:reloadConfigOnChange", "false");
Environment.SetEnvironmentVariable("ASPNETCORE_hostBuilder:reloadConfigOnChange", "false");

var builder = WebApplication.CreateBuilder(args);
// Yanıtlarda hangi web sunucusunun (Kestrel) çalıştığını gereksiz yere ifşa etmesin.
builder.WebHost.ConfigureKestrel(options => options.AddServerHeader = false);

const string FrontendCorsPolicy = "FrontendCorsPolicy";
builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://localhost:4173",
                "https://sahnem.com.tr",
                "https://www.sahnem.com.tr"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddHttpContextAccessor();

builder.Services.AddDbContext<SahnemDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IProfileService, ProfileService>();
builder.Services.AddScoped<IAdvertService, AdvertService>();
builder.Services.AddScoped<IOfferService, OfferService>();
builder.Services.AddScoped<IFavoriteService, FavoriteService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IMessageService, MessageService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.Configure<R2Settings>(builder.Configuration.GetSection("R2"));
builder.Services.AddScoped<IFileStorageService, R2FileStorageService>();
builder.Services.AddScoped<IPasswordService, PasswordService>();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddAutoMapper(typeof(AppUserProfileMapping));

builder.Services.AddValidatorsFromAssemblyContaining<AppUserRegisterValidator>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
var jwtSettings = builder.Configuration
    .GetSection("Jwt")
    .Get<JwtSettings>();

builder.Services.Configure<ZohoSmtpSettings>(builder.Configuration.GetSection("Zoho"));
builder.Services.AddScoped<IEmailService, ZohoEmailService>();


builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}

).AddJwtBearer( options =>

    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true, 
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings!.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings.Key)
            ),
            ClockSkew = TimeSpan.Zero
        };
    }

);

// IsProfileCompleted claim'ini kontrol eden, tekrar kullanılabilir policy.
// AdvertController/OfferController'daki "profilini tamamlamadan ilan/teklif
// oluşturamazsın" kuralı artık servis içindeki manuel throw'a ek olarak burada
// da (controller seviyesinde, isteğe daha erken 403 döner) uygulanıyor.
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("ProfileCompleted", policy =>
        policy.RequireClaim("IsProfileCompleted", "True"));
});

builder.Services.AddControllers()
    // Enum'lar JSON'da sayı yerine isim olarak dönsün ("Musician" gibi, 1 değil) —
    // API tüketen frontend/başka bir istemci için okunabilir ve kendi kendini
    // açıklayan bir sözleşme. allowIntegerValues varsayılan olarak true olduğu
    // için istemci yine de sayı gönderirse (geriye dönük uyumluluk) kabul edilir,
    // sadece ÇIKIŞ formatı değişiyor.
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();

// Login/kayıt/e-posta-tekrar-gönder gibi kötüye kullanıma açık uçlar için IP
// bazlı rate limit — sunucu Cloudflare arkasında olduğundan gerçek istemci IP'si
// CF-Connecting-IP header'ından okunuyor (RemoteIpAddress proxy'nin kendi IP'sini
// verir, aksi halde tüm istemciler tek bir limit havuzunu paylaşırdı).
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.AddPolicy("auth", httpContext =>
    {
        var key = httpContext.Request.Headers["CF-Connecting-IP"].FirstOrDefault()
            ?? httpContext.Connection.RemoteIpAddress?.ToString()
            ?? "unknown";

        return RateLimitPartition.GetSlidingWindowLimiter(key, _ => new SlidingWindowRateLimiterOptions
        {
            PermitLimit = 10,
            Window = TimeSpan.FromMinutes(1),
            SegmentsPerWindow = 4,
            QueueLimit = 0,
        });
    });
});

var app = builder.Build();

// Deploy pipeline'ında elle "dotnet ef database update" çalıştırmadığımız için
// bekleyen migration'lar her açılışta otomatik uygulanıyor. Idempotent —
// EF zaten uygulanmış migration'ları __EFMigrationsHistory tablosundan görüp atlıyor.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<SahnemDbContext>();
    db.Database.Migrate();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();

// Tarayıcı tarafında ekstra bir savunma katmanı — tek başına yeterli değil ama
// clickjacking/MIME-sniffing/aşırı Referrer sızıntısı gibi ucuz saldırıları
// bedavaya kapatıyor. API JSON döndüğü için CSP'yi de en kısıtlayıcı haliyle
// (default-src 'none') veriyoruz, gömülü hiçbir kaynak yüklenmemesi gerekiyor.
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("X-Frame-Options", "DENY");
    context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
    context.Response.Headers.Append("Content-Security-Policy", "default-src 'none'");
    if (!app.Environment.IsDevelopment())
    {
        context.Response.Headers.Append("Strict-Transport-Security", "max-age=63072000; includeSubDomains");
    }
    await next();
});

app.UseHttpsRedirection();
app.UseCors(FrontendCorsPolicy);
app.UseAuthentication();
app.UseAuthorization();
app.UseRateLimiter();
app.MapControllers();

app.MapGet("/health", () => Results.Ok(new
{
    status = "ok",
    service = "Sahnem API"
}));

app.Run();


