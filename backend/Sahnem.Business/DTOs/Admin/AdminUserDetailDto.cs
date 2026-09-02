using Sahnem.Business.DTOs.User;

namespace Sahnem.Business.DTOs.Admin
{
    public class AdminUserDetailDto
    {
        public AppUserResponseDto User {get; set;} = null!;
        public int AdvertCount {get; set;}
        public int OfferCount {get; set;}
        public int MessageCount {get; set;}
        public int ConversationCount {get; set;}
        public int FavoriteCount {get; set;}
        public string? ProfileSummary {get; set;}
    }
}
