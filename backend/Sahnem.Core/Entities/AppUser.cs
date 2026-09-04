using Sahnem.Core.Enums;

namespace Sahnem.Core.Entities
{
    public class AppUser : BaseEntity
    {
        public string FirstName {get; set;}
        public string LastName {get; set; }
        public string Email {get; set;}
        public string PasswordHash {get; set;}
        public string PhoneNumber {get; set;}
        public string? AvatarUrl {get; set;}
        public UserType Role {get; set;}
        public bool IsEmailConfirmed {get; set;} = false;
        public bool IsPhoneNumberConfirmed {get; set;} = false;
        public bool IsProfileCompleted {get; set;} = false;
        // Kayıt sırasında verilen iletişim izni — açıksa ve rolü Musician ise,
        // kendi şehrinde yeni bir ilan açıldığında bildirim/e-posta alır.
        public bool AllowCityAdvertAlerts {get; set;} = false;

        public string? EmailVerificationCode {get; set;}
        public DateTime? EmailVerificationCodeExpiresAt {get; set;}
        public DateTime? EmailVerificationCodeSentAt {get; set;}

        public string? PasswordResetCode {get; set;}
        public DateTime? PasswordResetCodeExpiresAt {get; set;}
        public DateTime? PasswordResetCodeSentAt {get; set;}

        public virtual MusicianProfile MusicianProfile {get; set;}
        public virtual OrganizerProfile OrganizerProfile {get; set;}
        public virtual VenueProfile VenueProfile {get; set;}

        public virtual ICollection<Offer> Offers {get; set;} = new List<Offer>();
        public virtual ICollection<Advert> Adverts {get; set;} = new List<Advert>();
        public virtual ICollection<RefreshToken> RefreshTokens {get; set;} = new List<RefreshToken>();

    }
}