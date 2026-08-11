using AutoMapper;
using Sahnem.Business.DTOs.Message;
using Sahnem.Core.Entities;

namespace Sahnem.Business.Dto.AutoMapping
{
    public class MessageMapping : Profile
    {
        public MessageMapping()
        {
            CreateMap<Message, MessageResponseDto>();
        }
    }
}
