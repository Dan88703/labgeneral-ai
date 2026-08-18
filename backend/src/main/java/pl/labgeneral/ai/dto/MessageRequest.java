package pl.labgeneral.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MessageRequest(
        @NotBlank(message = "Wiadomość nie może być pusta")
        @Size(max = 2000, message = "Wiadomość jest za długa (maksymalnie 2000 znaków)")
        String content
) {
}