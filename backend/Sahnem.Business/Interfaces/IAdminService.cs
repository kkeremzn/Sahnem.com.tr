using Sahnem.Business.DTOs;
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
        Task<PagedResultDto<AdminConversationDto>> GetConversations(int page = 1, int pageSize = 20, string? search = null);
        Task<IEnumerable<AdminMessageDto>> GetConversationMessages(int conversationId);
        Task DeleteMessage(int messageId);
        Task<AdminBroadcastResultDto> BroadcastNotification(AdminBroadcastNotificationDto dto);
        Task<AdminBroadcastResultDto> SendBulkEmail(AdminSendEmailDto dto);
    }
}
