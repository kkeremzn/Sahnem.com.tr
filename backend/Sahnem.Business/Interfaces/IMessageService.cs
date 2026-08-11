using Sahnem.Business.DTOs.Message;

namespace Sahnem.Business.Interfaces
{
    public interface IMessageService
    {
        Task<IEnumerable<ConversationResponseDto>> GetMyConversations();
        Task<IEnumerable<MessageResponseDto>> GetMessages(int conversationId);
        Task<MessageResponseDto> SendMessage(SendMessageDto dto);
        Task MarkConversationRead(int conversationId);
    }
}
