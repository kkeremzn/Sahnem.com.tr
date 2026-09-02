namespace Sahnem.Business.DTOs.Admin
{
    public class AdminStatsDto
    {
        public int TotalUsers {get; set;}
        public int TotalMusicians {get; set;}
        public int TotalOrganizers {get; set;}
        public int TotalVenues {get; set;}
        public int AbandonedSignups {get; set;}
        public int SuspendedUsers {get; set;}
        public int NewUsersLast7Days {get; set;}
        public int NewUsersLast30Days {get; set;}

        public int TotalAdverts {get; set;}
        public int OpenAdverts {get; set;}
        public int ClosedAdverts {get; set;}
        public int CancelledAdverts {get; set;}

        public int TotalOffers {get; set;}
        public int PendingOffers {get; set;}
        public int AcceptedOffers {get; set;}
        public int RejectedOffers {get; set;}

        public int TotalConversations {get; set;}
        public int TotalMessages {get; set;}

        public List<AdminRecentUserDto> RecentSignups {get; set;} = new();
        public List<AdminRecentAdvertDto> RecentAdverts {get; set;} = new();
    }

    public class AdminRecentUserDto
    {
        public int Id {get; set;}
        public string FirstName {get; set;} = string.Empty;
        public string LastName {get; set;} = string.Empty;
        public string Email {get; set;} = string.Empty;
        public string Role {get; set;} = string.Empty;
        public DateTime CreatedDate {get; set;}
    }

    public class AdminRecentAdvertDto
    {
        public int Id {get; set;}
        public string Title {get; set;} = string.Empty;
        public string Status {get; set;} = string.Empty;
        public DateTime CreatedDate {get; set;}
    }
}
