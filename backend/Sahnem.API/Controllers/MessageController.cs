using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sahnem.Business.DTOs.Message;
using Sahnem.Business.Interfaces;

namespace Sahnem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MessageController : ControllerBase
    {
        private readonly IMessageService _messageService;

        public MessageController(IMessageService messageService)
        {
            _messageService = messageService;
        }

        [HttpGet("conversations")]
        public async Task<IActionResult> GetMyConversations()
        {
            var result = await _messageService.GetMyConversations();
            return Ok(result);
        }

        [HttpGet("conversation/{conversationId:int}")]
        public async Task<IActionResult> GetMessages(int conversationId)
        {
            var result = await _messageService.GetMessages(conversationId);
            return Ok(result);
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageDto dto)
        {
            var result = await _messageService.SendMessage(dto);
            return Ok(result);
        }

        [HttpPut("conversation/{conversationId:int}/read")]
        public async Task<IActionResult> MarkConversationRead(int conversationId)
        {
            await _messageService.MarkConversationRead(conversationId);
            return Ok();
        }
    }
}
