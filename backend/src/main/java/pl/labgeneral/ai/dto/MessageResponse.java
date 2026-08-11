package pl.labgeneral.ai.dto;

import pl.labgeneral.ai.entity.MessageRole;

public record MessageResponse(
        Long id,
        String content,
        MessageRole role
) {
}