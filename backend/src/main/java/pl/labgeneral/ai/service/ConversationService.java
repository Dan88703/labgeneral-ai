package pl.labgeneral.ai.service;

import pl.labgeneral.ai.entity.Conversation;
import pl.labgeneral.ai.repository.ConversationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;

    public ConversationService(ConversationRepository conversationRepository) {
        this.conversationRepository = conversationRepository;
    }

    public Conversation getById(Long id) {
        return conversationRepository.findWithMessagesById(id)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
    }

    public List<Conversation> getBySession(String sessionId) {
        return conversationRepository.findBySessionId(sessionId);
    }

    public Conversation create(String title, String sessionId) {
        Conversation conversation = new Conversation();
        conversation.setTitle(title);
        conversation.setSessionId(sessionId);
        conversation.setCreatedAt(LocalDateTime.now());
        return conversationRepository.save(conversation);
    }

    public void deleteOwnedBy(Long id, String sessionId) {
        Conversation conversation = conversationRepository.findByIdAndSessionId(id, sessionId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
        conversationRepository.delete(conversation);
    }
}