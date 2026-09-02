using Microsoft.EntityFrameworkCore;
using Sahnem.Core.Entities;

namespace Sahnem.DataAccess.Contexts
{
    public class SahnemDbContext : DbContext
    {
        public SahnemDbContext(DbContextOptions<SahnemDbContext> options) : base(options)
        {

        }


        public DbSet<AppUser> Users { get; set; }
        public DbSet<MusicianProfile> MusicianProfiles { get; set; }
        public DbSet<OrganizerProfile> OrganizerProfiles { get; set; }
        public DbSet<VenueProfile> VenueProfiles { get; set; }
        public DbSet<Offer> Offers { get; set; }
        public DbSet<Advert> Adverts { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<AdminRefreshToken> AdminRefreshTokens { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Kullanıcı ve Müzisyen profili bire bir ilişki
            modelBuilder.Entity<MusicianProfile>()
            .HasOne(m=>m.AppUser)
            .WithOne(u=>u.MusicianProfile)
            .HasForeignKey<MusicianProfile>(m=>m.AppUserId);

            // Kullanıcı ve mekan profili bire bir ilişki
            modelBuilder.Entity<VenueProfile>()
            .HasOne(v=>v.AppUser)
            .WithOne(u=>u.VenueProfile)
            .HasForeignKey<VenueProfile>(v=>v.AppUserId);

            // Kullanıcı ve organizatör profili bire bir ilişki
            modelBuilder.Entity<OrganizerProfile>()
            .HasOne(o=>o.AppUser)
            .WithOne(u=>u.OrganizerProfile)
            .HasForeignKey<OrganizerProfile>(o=>o.AppUserId);

            //Offer ve advert ilişkisi
            modelBuilder.Entity<Offer>()
            .HasOne(o=>o.Advert)
            .WithMany(a=>a.Offers)
            .HasForeignKey(o=>o.AdvertId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Offer>()
            .HasOne(o=>o.Musician)
            .WithMany(u=>u.Offers)
            .HasForeignKey(o=>o.MusicianId)
            .OnDelete(DeleteBehavior.Restrict);

            // EF Core'un decimal alanlar için varsayılan hassasiyeti değerleri
            // sessizce kırpabildiğine dair uyarısını gidermek için açık precision.
            modelBuilder.Entity<Advert>()
            .Property(a => a.Budget)
            .HasPrecision(18, 2);

            modelBuilder.Entity<Offer>()
            .Property(o => o.ProposedPrice)
            .HasPrecision(18, 2);

            // Refresh token - kullanıcı ilişkisi
            modelBuilder.Entity<RefreshToken>()
            .HasOne(r => r.AppUser)
            .WithMany(u => u.RefreshTokens)
            .HasForeignKey(r => r.AppUserId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RefreshToken>()
            .HasIndex(r => r.Token)
            .IsUnique();

            // Favoriler: sahip (Organizer/Venue) ve favorilenen müzisyen, ikisi de AppUser
            modelBuilder.Entity<Favorite>()
            .HasOne(f => f.Owner)
            .WithMany()
            .HasForeignKey(f => f.OwnerUserId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Favorite>()
            .HasOne(f => f.Musician)
            .WithMany()
            .HasForeignKey(f => f.MusicianUserId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Favorite>()
            .HasIndex(f => new { f.OwnerUserId, f.MusicianUserId })
            .IsUnique();

            // Bildirimler
            modelBuilder.Entity<Notification>()
            .HasOne(n => n.User)
            .WithMany()
            .HasForeignKey(n => n.UserId)
            .OnDelete(DeleteBehavior.Restrict);

            // Sohbetler: iki taraf da AppUser
            modelBuilder.Entity<Conversation>()
            .HasOne(c => c.UserA)
            .WithMany()
            .HasForeignKey(c => c.UserAId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Conversation>()
            .HasOne(c => c.UserB)
            .WithMany()
            .HasForeignKey(c => c.UserBId)
            .OnDelete(DeleteBehavior.Restrict);

            // Mesajlar
            modelBuilder.Entity<Message>()
            .HasOne(m => m.Conversation)
            .WithMany(c => c.Messages)
            .HasForeignKey(m => m.ConversationId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>()
            .HasOne(m => m.Sender)
            .WithMany()
            .HasForeignKey(m => m.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

            // Admin — AppUser'dan tamamen bağımsız bir tablo, hiçbir ilişkisi yok.
            modelBuilder.Entity<Admin>()
            .HasIndex(a => a.Username)
            .IsUnique();

            modelBuilder.Entity<Admin>()
            .HasIndex(a => a.Email)
            .IsUnique();

            modelBuilder.Entity<AdminRefreshToken>()
            .HasOne(r => r.Admin)
            .WithMany(a => a.RefreshTokens)
            .HasForeignKey(r => r.AdminId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AdminRefreshToken>()
            .HasIndex(r => r.Token)
            .IsUnique();

        }
    }
}