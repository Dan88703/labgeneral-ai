package pl.labgeneral.ai.repository;

import pl.labgeneral.ai.entity.Conversation;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    List<Conversation> findBySessionId(String sessionId);
    Optional<Conversation> findByIdAndSessionId(Long id, String sessionId);
    @EntityGraph(attributePaths = "messages")
    Optional<Conversation> findWithMessagesById(Long id);
}