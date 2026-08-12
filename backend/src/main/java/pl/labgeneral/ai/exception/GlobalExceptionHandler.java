package pl.labgeneral.ai.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(OpenAiException.class)
    public ResponseEntity<Map<String, String>> handleOpenAi(OpenAiException e) {
        e.printStackTrace(); // временно, для отладки
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                .body(Map.of("error", "AI_UNAVAILABLE", "message", e.getMessage()));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntime(RuntimeException e) {
        HttpStatus status = e.getMessage() != null && e.getMessage().contains("not found")
                ? HttpStatus.NOT_FOUND
                : HttpStatus.INTERNAL_SERVER_ERROR;
        return ResponseEntity.status(status)
                .body(Map.of("error", status.name(), "message", e.getMessage()));
    }
}