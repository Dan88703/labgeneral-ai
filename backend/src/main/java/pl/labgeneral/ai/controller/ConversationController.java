package pl.labgeneral.ai.controller;

import pl.labgeneral.ai.dto.ConversationResponse;
import pl.labgeneral.ai.entity.Conversation;
import pl.labgeneral.ai.service.ConversationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conversations")
@CrossOrigin(origins = {"http://localhost:5173", "https://ваш-проект.vercel.app"})
public class ConversationController {

    private final ConversationService conversationService;

    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    @GetMapping
    public List<ConversationResponse> getAll() {
        return conversationService.getAll()
                .stream()
                .map(conversation -> new ConversationResponse(
                        conversation.getId(),
                        conversation.getTitle(),
                        conversation.getCreatedAt()
                ))
                .toList();
    }

    @GetMapping("/{id}")
    public Conversation getById(@PathVariable Long id) {
        return conversationService.getById(id);
    }

    @PostMapping
    public Conversation create(@RequestParam String title) {
        return conversationService.create(title);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        conversationService.delete(id);
    }
}