using Sahnem.Core.Enums;

namespace Sahnem.Business.DTOs.User
{

    public class AppUserResponseDto
    {
        public int Id{get; set;}
        public string FirstName{get; set;}
        public string LastName{get; set;}
        public string Email{get; set;}
        public string PhoneNumber{get; set;}
        public string? AvatarUrl{get; set;}
        public UserType Role{get; set;}
        public bool IsEmailConfirmed{get; set;}
        public bool IsPhoneNumberConfirmed{get; set;}
        public bool IsProfileCompleted{get; set;}
        public bool IsActive{get; set;}
        public DateTime CreatedDate{get; set;}
    }

}
