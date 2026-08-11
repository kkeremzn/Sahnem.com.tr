using AutoMapper;
using Sahnem.Business.DTOs.Notification;
using Sahnem.Business.Interfaces;
using Sahnem.Business.Security;
using Sahnem.Core.Entities;
using Sahnem.Core.Interfaces;

namespace Sahnem.Business.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IGenericRepository<Notification> _notificationRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ICurrentUserService _currentUserService;

        public NotificationService(
            IGenericRepository<Notification> notificationRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ICurrentUserService currentUserService)
        {
            _notificationRepository = notificationRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _currentUserService = currentUserService;
        }

        public async Task<IEnumerable<NotificationResponseDto>> GetMyNotifications()
        {
            var userId = _currentUserService.UserId;
            var notifications = await _notificationRepository.WhereAsync(n => n.UserId == userId);
            var ordered = notifications.OrderByDescending(n => n.CreatedDate);
            return _mapper.Map<IEnumerable<NotificationResponseDto>>(ordered);
        }

        public async Task MarkAsRead(int notificationId)
        {
            var notification = await _notificationRepository.GetByIdAsync(notificationId);
            if (notification == null)
            {
                throw new Exception("Notification not found");
            }
            if (notification.UserId != _currentUserService.UserId)
            {
                throw new Exception("You are not authorized to update this notification");
            }
            notification.IsRead = true;
            await _unitOfWork.SaveChanges();
        }

        public async Task MarkAllAsRead()
        {
            var userId = _currentUserService.UserId;
            var notifications = await _notificationRepository.WhereAsync(n => n.UserId == userId && !n.IsRead);
            foreach (var notification in notifications)
            {
                notification.IsRead = true;
            }
            await _unitOfWork.SaveChanges();
        }

        public async Task CreateNotification(int userId, string type, string title, string body, string? linkTo = null)
        {
            await _notificationRepository.AddAsync(new Notification
            {
                UserId = userId,
                Type = type,
                Title = title,
                Body = body,
                LinkTo = linkTo,
                IsRead = false,
            });
            await _unitOfWork.SaveChanges();
        }
    }
}
