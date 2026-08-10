using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace Sahnem.Business.Security
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }
    
    
        
    


        public int UserId =>
            int.Parse(
                _httpContextAccessor.HttpContext!.User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        public string? Email =>
            _httpContextAccessor.HttpContext!.User.FindFirstValue(ClaimTypes.Email);

        public string? Role =>
            _httpContextAccessor.HttpContext!.User.FindFirstValue(ClaimTypes.Role);

        public bool IsProfileCompleted =>
            bool.Parse(
                _httpContextAccessor.HttpContext!.User.FindFirstValue("IsProfileCompleted")!
            );

            
    }
    
}