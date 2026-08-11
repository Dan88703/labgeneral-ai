package pl.labgeneral.ai.repository;

import pl.labgeneral.ai.entity.Conversation;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @EntityGraph(attributePaths = "messages")
    Optional<Conversation> findWithMessagesById(Long id);
}