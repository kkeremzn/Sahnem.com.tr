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

        }
    }
}