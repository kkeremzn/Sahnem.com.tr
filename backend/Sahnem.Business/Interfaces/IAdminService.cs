using Sahnem.Business.DTOs.Admin;
using Sahnem.Core.Enums;

namespace Sahnem.Business.Interfaces
{
    // Bu servisin tüm metodları yalnızca Admin rolünden çağrılmalı — kontrol hem
    // controller'da [Authorize(Roles="Admin")] hem burada (defense-in-depth) yapılıyor.
    public interface IAdminService
    {
        Task<IEnumerable<PendingVerificationDto>> GetPendingVerifications();
        Task SetVerificationStatus(string kind, int profileId, VerificationStatus status);
    }
}
