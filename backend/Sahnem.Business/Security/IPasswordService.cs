using Sahnem.Core.Entities;

namespace Sahnem.Business.Security
{
    public interface IPasswordService
    {
        string HashPassword(AppUser appUser, string password);
        bool VerifyPassword(AppUser appUser, string hashedPassword, string providedPassword);
    }
}