using Sahnem.Core.Enums;

namespace Sahnem.Business.DTOs.Profile
{
    // Organizer ve Venue'yu tek bir listede (müzisyenlerin "işveren keşfet"
    // yapabilmesi için) göstermeye yarayan ortak özet — GetEmployerByUserId'nin
    // döndürdüğü tam profillerin aksine, kart görünümü için yeterli alanları taşır.
    public class EmployerSummaryDto
    {
        public int AppUserId { get; set; }
        public string Kind { get; set; } = string.Empty; // "Organizer" | "Venue"
        public string Name { get; set; } = string.Empty;
        public OrganizerType? OrganizerType { get; set; }
        public VenueType? VenueType { get; set; }
        public string Bio { get; set; } = string.Empty;
        public City City { get; set; }
        public string? District { get; set; }
        public string? AvatarUrl { get; set; }
    }

    public class EmployerFilterDto
    {
        public string? Search { get; set; }
        public City? City { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}
