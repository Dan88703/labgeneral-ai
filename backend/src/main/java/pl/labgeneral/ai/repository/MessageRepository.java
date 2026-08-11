package pl.labgeneral.ai.repository;

import pl.labgeneral.ai.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByConversationIdOrderByIdAsc(Long conversationId);
}