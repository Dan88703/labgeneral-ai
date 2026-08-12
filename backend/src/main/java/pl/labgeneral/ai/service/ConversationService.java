package pl.labgeneral.ai.service;

import pl.labgeneral.ai.entity.Conversation;
import pl.labgeneral.ai.repository.ConversationRepository;
import org.springframework.stereotype.Service;
import pl.labgeneral.ai.entity.Message;
import pl.labgeneral.ai.entity.MessageRole;
import pl.labgeneral.ai.repository.MessageRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ConversationService {
    private final MessageRepository messageRepository;

    private final ConversationRepository conversationRepository;

    public ConversationService(ConversationRepository conversationRepository,
                               MessageRepository messageRepository
    ) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;

    }

    public List<Conversation> getAll() {
        return conversationRepository.findAll();
    }

    public Conversation getById(Long id) {
        return conversationRepository.findWithMessagesById(id)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
    }

    public Conversation create(String title) {
        Conversation conversation = new Conversation();
        conversation.setTitle(title);
        conversation.setCreatedAt(LocalDateTime.now());

        return conversationRepository.save(conversation);
    }

    public void delete(Long id) {
        conversationRepository.deleteById(id);
    }
}