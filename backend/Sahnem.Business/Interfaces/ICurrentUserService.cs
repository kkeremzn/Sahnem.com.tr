namespace Sahnem.Business.Security
{
    public interface ICurrentUserService
    {
        int UserId { get; }
        string? Email { get; }
        string? Role { get; }
        bool IsProfileCompleted{get;}
    }
}