package pl.labgeneral.ai.controller;

import pl.labgeneral.ai.dto.ConversationResponse;
import pl.labgeneral.ai.entity.Conversation;
import pl.labgeneral.ai.service.ConversationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conversations")
public class ConversationController {

    private final ConversationService conversationService;

    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    @GetMapping
    public List<ConversationResponse> getAll(@RequestHeader("X-Session-Id") String sessionId) {
        return conversationService.getBySession(sessionId)
                .stream()
                .map(c -> new ConversationResponse(c.getId(), c.getTitle(), c.getCreatedAt()))
                .toList();
    }

    @GetMapping("/{id}")
    public Conversation getById(@PathVariable Long id) {
        return conversationService.getById(id);
    }

    @PostMapping
    public Conversation create(@RequestParam String title, @RequestHeader("X-Session-Id") String sessionId) {
        return conversationService.create(title, sessionId);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, @RequestHeader("X-Session-Id") String sessionId) {
        conversationService.deleteOwnedBy(id, sessionId);
    }
}