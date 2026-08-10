namespace Sahnem.Business.DTOs.User
{
    public class AppUserUpdateDto
    {
        public string FirstName {get; set;}
        public string LastName {get; set; }
        public string PhoneNumber {get; set;}
        public string? AvatarUrl {get; set;}
    }
}