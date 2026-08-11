package pl.labgeneral.ai.service;

import pl.labgeneral.ai.dto.MessageRequest;
import pl.labgeneral.ai.dto.MessageResponse;
import pl.labgeneral.ai.entity.Conversation;
import pl.labgeneral.ai.entity.Message;
import pl.labgeneral.ai.repository.ConversationRepository;
import pl.labgeneral.ai.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;

    public MessageService(
            MessageRepository messageRepository,
            ConversationRepository conversationRepository
    ) {
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
    }

    public MessageResponse create(Long conversationId, MessageRequest request) {

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        Message message = new Message();
        message.setContent(request.content());
        message.setRole(request.role());
        message.setConversation(conversation);

        Message saved = messageRepository.save(message);

        return new MessageResponse(
                saved.getId(),
                saved.getContent(),
                saved.getRole()
        );
    }

    public List<MessageResponse> getByConversation(Long conversationId) {

        if (!conversationRepository.existsById(conversationId)) {
            throw new RuntimeException("Conversation not found");
        }

        return messageRepository
                .findByConversationIdOrderByIdAsc(conversationId)
                .stream()
                .map(message -> new MessageResponse(
                        message.getId(),
                        message.getContent(),
                        message.getRole()
                ))
                .toList();
    }
}