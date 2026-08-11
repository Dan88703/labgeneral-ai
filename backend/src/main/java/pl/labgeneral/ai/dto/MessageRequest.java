package pl.labgeneral.ai.dto;

import pl.labgeneral.ai.entity.MessageRole;

public record MessageRequest(
        String content,
        MessageRole role
) {
}