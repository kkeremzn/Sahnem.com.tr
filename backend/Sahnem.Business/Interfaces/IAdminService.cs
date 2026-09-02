using Sahnem.Business.DTOs.Admin;

namespace Sahnem.Business.Interfaces
{
    // Bu servisin tüm metodlarına yalnızca AdminController üzerinden erişilir —
    // o controller [Authorize(Policy="SystemAdmin")] ile korunuyor (ayrı bir kimlik
    // doğrulama şeması, normal kullanıcı sisteminden bağımsız).
    public interface IAdminService
    {
        Task<AdminStatsDto> GetStats();
        Task<AdminUserDetailDto> GetUserDetail(int userId);
    }
}
