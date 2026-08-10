using Sahnem.Core.Entities;

using Microsoft.AspNetCore.Identity;

namespace Sahnem.Business.Security
{
public class PasswordService : IPasswordService
    {
        private readonly PasswordHasher<AppUser> _passwordHasher = new PasswordHasher<AppUser>();


        public string HashPassword(AppUser appUser, string password)
        {
            return _passwordHasher.HashPassword(appUser,password);
        }

        public bool VerifyPassword(AppUser appUser, string hashedPassword, string providedPassword)
        {
            var result = _passwordHasher.VerifyHashedPassword(appUser, hashedPassword, providedPassword);
            return result == PasswordVerificationResult.Success ||
                   result == PasswordVerificationResult.SuccessRehashNeeded;
        }

    }        
        

        
}
