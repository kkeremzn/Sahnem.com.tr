using Sahnem.Core.Enums;

namespace Sahnem.Business.DTOs.User
{
    public class AppUserRegisterDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; } //Sonradan Hashlenecek şifre
        public string PhoneNumber { get; set; }
    }
}