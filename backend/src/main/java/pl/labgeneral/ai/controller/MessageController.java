package pl.labgeneral.ai.controller;

import jakarta.validation.Valid;
import pl.labgeneral.ai.dto.MessageRequest;
import pl.labgeneral.ai.dto.MessageResponse;
import pl.labgeneral.ai.service.MessageService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conversations/{conversationId}/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping
    public MessageResponse create(
            @PathVariable Long conversationId,
            @Valid @RequestBody MessageRequest request
    ) {
        return messageService.create(conversationId, request);
    }

    @GetMapping
    public List<MessageResponse> getAll(@PathVariable Long conversationId) {
        return messageService.getByConversation(conversationId);
    }
}