using AutoMapper;
using Sahnem.Business.DTOs.Message;
using Sahnem.Business.Interfaces;
using Sahnem.Business.Security;
using Sahnem.Core.Entities;
using Sahnem.Core.Enums;
using Sahnem.Core.Interfaces;

namespace Sahnem.Business.Services
{
    public class MessageService : IMessageService
    {
        private readonly IGenericRepository<Conversation> _conversationRepository;
        private readonly IGenericRepository<Message> _messageRepository;
        private readonly IGenericRepository<AppUser> _userRepository;
        private readonly IGenericRepository<OrganizerProfile> _organizerProfileRepository;
        private readonly IGenericRepository<VenueProfile> _venueProfileRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ICurrentUserService _currentUserService;
        private readonly INotificationService _notificationService;

        public MessageService(
            IGenericRepository<Conversation> conversationRepository,
            IGenericRepository<Message> messageRepository,
            IGenericRepository<AppUser> userRepository,
            IGenericRepository<OrganizerProfile> organizerProfileRepository,
            IGenericRepository<VenueProfile> venueProfileRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ICurrentUserService currentUserService,
            INotificationService notificationService)
        {
            _conversationRepository = conversationRepository;
            _messageRepository = messageRepository;
            _userRepository = userRepository;
            _organizerProfileRepository = organizerProfileRepository;
            _venueProfileRepository = venueProfileRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _currentUserService = currentUserService;
            _notificationService = notificationService;
        }

        public async Task<IEnumerable<ConversationResponseDto>> GetMyConversations()
        {
            var userId = _currentUserService.UserId;
            var conversations = await _conversationRepository.WhereAsync(c => c.UserAId == userId || c.UserBId == userId);
            var list = conversations.OrderByDescending(c => c.LastMessageAt).ToList();
            if (list.Count == 0)
            {
                return Enumerable.Empty<ConversationResponseDto>();
            }

            var participantIds = list.Select(c => c.UserAId == userId ? c.UserBId : c.UserAId).Distinct().ToList();
            var participants = await _userRepository.WhereAsync(u => participantIds.Contains(u.Id));
            var organizers = await _organizerProfileRepository.WhereAsync(o => participantIds.Contains(o.AppUserId));
            var venues = await _venueProfileRepository.WhereAsync(v => participantIds.Contains(v.AppUserId));

            return list.Select(c =>
            {
                var isA = c.UserAId == userId;
                var participantId = isA ? c.UserBId : c.UserAId;
                var participant = participants.FirstOrDefault(u => u.Id == participantId);

                return new ConversationResponseDto
                {
                    Id = c.Id,
                    ParticipantId = participantId,
                    ParticipantName = ResolveDisplayName(participant, organizers, venues),
                    ParticipantRole = participant?.Role.ToString() ?? "",
                    LastMessage = c.LastMessage,
                    LastMessageAt = c.LastMessageAt,
                    UnreadCount = isA ? c.UnreadCountA : c.UnreadCountB,
                };
            });
        }

        public async Task<IEnumerable<MessageResponseDto>> GetMessages(int conversationId)
        {
            var conversation = await GetOwnedConversation(conversationId);
            var messages = await _messageRepository.WhereAsync(m => m.ConversationId == conversation.Id);
            var ordered = messages.OrderBy(m => m.CreatedDate);
            return _mapper.Map<IEnumerable<MessageResponseDto>>(ordered);
        }

        public async Task<MessageResponseDto> SendMessage(SendMessageDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Body))
            {
                throw new Exception("Message body can not be empty");
            }

            var senderId = _currentUserService.UserId;
            Conversation conversation;

            if (dto.ConversationId.HasValue)
            {
                conversation = await GetOwnedConversation(dto.ConversationId.Value);
            }
            else
            {
                if (!dto.RecipientUserId.HasValue)
                {
                    throw new Exception("Either conversationId or recipientUserId is required");
                }
                if (dto.RecipientUserId.Value == senderId)
                {
                    throw new Exception("You cannot start a conversation with yourself");
                }

                var recipient = await _userRepository.GetByIdAsync(dto.RecipientUserId.Value);
                if (recipient == null)
                {
                    throw new Exception("Recipient not found");
                }

                var existing = await _conversationRepository.FirstOrDefaultAsync(c =>
                    (c.UserAId == senderId && c.UserBId == dto.RecipientUserId.Value) ||
                    (c.UserAId == dto.RecipientUserId.Value && c.UserBId == senderId));

                if (existing != null)
                {
                    conversation = existing;
                }
                else
                {
                    conversation = new Conversation
                    {
                        UserAId = senderId,
                        UserBId = dto.RecipientUserId.Value,
                        LastMessage = "",
                        LastMessageAt = DateTime.UtcNow,
                    };
                    await _conversationRepository.AddAsync(conversation);
                    await _unitOfWork.SaveChanges();
                }
            }

            var message = new Message
            {
                ConversationId = conversation.Id,
                SenderId = senderId,
                Body = dto.Body.Trim(),
            };
            await _messageRepository.AddAsync(message);

            conversation.LastMessage = message.Body;
            conversation.LastMessageAt = DateTime.UtcNow;
            var isSenderA = conversation.UserAId == senderId;
            if (isSenderA)
            {
                conversation.UnreadCountB += 1;
            }
            else
            {
                conversation.UnreadCountA += 1;
            }

            await _unitOfWork.SaveChanges();

            var recipientId = isSenderA ? conversation.UserBId : conversation.UserAId;
            var sender = await _userRepository.GetByIdAsync(senderId);
            await _notificationService.CreateNotification(
                recipientId,
                "message",
                "Yeni mesaj",
                $"{sender?.FirstName} {sender?.LastName} size bir mesaj gönderdi.",
                $"/messages/{conversation.Id}");

            return _mapper.Map<MessageResponseDto>(message);
        }

        public async Task MarkConversationRead(int conversationId)
        {
            var conversation = await GetOwnedConversation(conversationId);
            var userId = _currentUserService.UserId;
            if (conversation.UserAId == userId)
            {
                conversation.UnreadCountA = 0;
            }
            else
            {
                conversation.UnreadCountB = 0;
            }
            await _unitOfWork.SaveChanges();
        }

        private async Task<Conversation> GetOwnedConversation(int conversationId)
        {
            var conversation = await _conversationRepository.GetByIdAsync(conversationId);
            if (conversation == null)
            {
                throw new Exception("Conversation not found");
            }
            var userId = _currentUserService.UserId;
            if (conversation.UserAId != userId && conversation.UserBId != userId)
            {
                throw new Exception("You are not authorized to access this conversation");
            }
            return conversation;
        }

        private static string ResolveDisplayName(AppUser? user, IEnumerable<OrganizerProfile> organizers, IEnumerable<VenueProfile> venues)
        {
            if (user == null) return "";
            return user.Role switch
            {
                UserType.Organizer => organizers.FirstOrDefault(o => o.AppUserId == user.Id)?.OrganizerName ?? $"{user.FirstName} {user.LastName}",
                UserType.Venue => venues.FirstOrDefault(v => v.AppUserId == user.Id)?.VenueName ?? $"{user.FirstName} {user.LastName}",
                _ => $"{user.FirstName} {user.LastName}",
            };
        }
    }
}
