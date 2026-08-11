using Sahnem.Business.DTOs.Notification;

namespace Sahnem.Business.Interfaces
{
    public interface INotificationService
    {
        Task<IEnumerable<NotificationResponseDto>> GetMyNotifications();
        Task MarkAsRead(int notificationId);
        Task MarkAllAsRead();

        // Diğer servisler (Offer, Message) tarafından event tetikli bildirim
        // üretmek için kullanılır — controller'dan doğrudan çağrılmaz.
        Task CreateNotification(int userId, string type, string title, string body, string? linkTo = null);
    }
}
