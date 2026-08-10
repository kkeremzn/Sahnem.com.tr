using Sahnem.Business.DTOs;
using Sahnem.Core.Entities;

namespace Sahnem.Business.Security
{
    public interface IJwtService
    {
        public AuthResponseDto GenerateToken(AppUser appUser);
    }
}