package pl.labgeneral.ai.exception;

public class OpenAiException extends RuntimeException {
    public OpenAiException(String message) {
        super(message);
    }
}