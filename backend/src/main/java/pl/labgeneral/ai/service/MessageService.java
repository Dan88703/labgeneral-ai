package pl.labgeneral.ai.service;

import lombok.RequiredArgsConstructor;
import pl.labgeneral.ai.dto.MessageRequest;
import pl.labgeneral.ai.dto.MessageResponse;
import pl.labgeneral.ai.entity.Conversation;
import pl.labgeneral.ai.entity.Message;
import pl.labgeneral.ai.entity.MessageRole;
import pl.labgeneral.ai.repository.ConversationRepository;
import pl.labgeneral.ai.repository.MessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final OpenAiService openAiService;
    private final RetrievalService retrievalService;

    @Transactional
    public MessageResponse create(Long conversationId, MessageRequest request) {

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        Message userMessage = new Message();
        userMessage.setContent(request.content());
        userMessage.setRole(MessageRole.USER);
        userMessage.setConversation(conversation);
        messageRepository.save(userMessage);

        List<Message> history = messageRepository.findByConversationIdOrderByIdAsc(conversationId);

        // NOWOŚĆ: pobieramy pasujące fragmenty wiedzy przed wywołaniem AI
        List<RetrievalService.RetrievedChunk> chunks =
                retrievalService.retrieveRelevantChunks(request.content(), 4);

        String aiAnswer = openAiService.askGpt(history, chunks);

        Message assistantMessage = new Message();
        assistantMessage.setContent(aiAnswer);
        assistantMessage.setRole(MessageRole.ASSISTANT);
        assistantMessage.setConversation(conversation);
        Message saved = messageRepository.save(assistantMessage);

        return new MessageResponse(saved.getId(), saved.getContent(), saved.getRole());
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