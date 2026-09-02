using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace Sahnem.Business.Security
{
    public class CurrentAdminService : ICurrentAdminService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentAdminService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public int AdminId =>
            int.Parse(
                _httpContextAccessor.HttpContext!.User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }
}
