using System.Net;
using System.Text.Json;
using FluentValidation;

namespace Sahnem.API.Middleware
{
    // Tüm controller'lar için tek noktadan hata yakalama. Servis katmanı şu an
    // ayrım gözetmeksizin `throw new Exception(...)` kullanıyor (özel exception
    // tipleri yok): ValidationException -> 400 + alan bazlı hatalar. Diğer
    // Exception'lar için mesaj içeriğine göre değil, **tam tipe** göre ayrım
    // yapılıyor — kod tabanındaki her kasıtlı iş kuralı ihlali `throw new
    // Exception("...")` (taban tip) kullanıyor, bu yüzden tam olarak `typeof(Exception)`
    // olanlar istemci hatası (400) sayılıyor; NullReferenceException, SqlException
    // gibi türetilmiş/beklenmeyen tipler 500 olarak işaretlenip stack trace
    // sızdırılmadan genel bir mesajla döndürülüyor. Önceki sürüm mesaj metninde
    // anahtar kelime arıyordu ve "Only JPEG... allowed" gibi listede olmayan
    // kalıpları yanlışlıkla 500'e düşürüyordu; tip bazlı kontrol bu sınıfa
    // giren TÜM kasıtlı throw'ları güvenilir şekilde yakalar.
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;
        private readonly IHostEnvironment _env;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger, IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (ValidationException ex)
            {
                _logger.LogWarning(ex, "Validation hatası: {Path}", context.Request.Path);
                await WriteResponse(context, HttpStatusCode.BadRequest, "Girdi doğrulama hatası.",
                    ex.Errors.Select(e => new { field = e.PropertyName, message = e.ErrorMessage }));
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, "Yetkisiz erişim: {Path}", context.Request.Path);
                await WriteResponse(context, HttpStatusCode.Forbidden, ex.Message, null);
            }
            catch (Exception ex)
            {
                // Servis katmanının kasıtlı attığı iş kuralı hataları her zaman
                // tam `Exception` tipinde (alt sınıf değil) — bu yüzden gerçekten
                // beklenmeyen hatalardan (NullReferenceException, SqlException, vb.)
                // güvenilir şekilde ayırt edilebiliyor.
                var isKnownClientError = ex.GetType() == typeof(Exception);
                var status = isKnownClientError ? HttpStatusCode.BadRequest : HttpStatusCode.InternalServerError;

                if (isKnownClientError)
                {
                    _logger.LogInformation(ex, "İstemci hatası: {Path}", context.Request.Path);
                }
                else
                {
                    _logger.LogError(ex, "Beklenmeyen hata: {Path}", context.Request.Path);
                }

                var message = isKnownClientError || _env.IsDevelopment()
                    ? ex.Message
                    : "Beklenmeyen bir hata oluştu.";

                await WriteResponse(context, status, message, null);
            }
        }

        private static Task WriteResponse(HttpContext context, HttpStatusCode status, string message, object? errors)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)status;
            var payload = JsonSerializer.Serialize(new { message, errors }, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            });
            return context.Response.WriteAsync(payload);
        }
    }
}
