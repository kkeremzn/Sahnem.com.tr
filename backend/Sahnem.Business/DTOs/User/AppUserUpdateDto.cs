namespace Sahnem.Business.DTOs.User
{
    public class AppUserUpdateDto
    {
        public string FirstName {get; set;}
        public string LastName {get; set; }
        public string PhoneNumber {get; set;}
        public string? AvatarUrl {get; set;}
    }

    // Genel profil güncelleme DTO'suna eklenseydi, bu alanı hiç göndermeyen her
    // "isim/telefon/avatar güncelle" isteği bool varsayılanı (false) yüzünden
    // kullanıcının bildirim tercihini sessizce sıfırlardı — bu yüzden ayrı bir uç.
    public class UpdateNotificationPreferencesDto
    {
        public bool AllowCityAdvertAlerts {get; set;}
    }
}