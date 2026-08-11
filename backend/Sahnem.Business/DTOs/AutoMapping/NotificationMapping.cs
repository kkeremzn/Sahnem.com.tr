using AutoMapper;
using Sahnem.Business.DTOs.Notification;
using Sahnem.Core.Entities;

namespace Sahnem.Business.Dto.AutoMapping
{
    public class NotificationMapping : Profile
    {
        public NotificationMapping()
        {
            CreateMap<Notification, NotificationResponseDto>();
        }
    }
}
