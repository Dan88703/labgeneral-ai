package pl.labgeneral.ai.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import pl.labgeneral.ai.entity.Message;
import pl.labgeneral.ai.entity.MessageRole;
import pl.labgeneral.ai.exception.OpenAiException;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OpenAiService {

    private final WebClient openAiWebClient;

    @Value("${openai.model}")
    private String model;

    public OpenAiService(WebClient openAiWebClient) {
        this.openAiWebClient = openAiWebClient;
    }

    // ДОБАВЛЕН второй параметр chunks
    public String askGpt(List<Message> history, List<RetrievalService.RetrievedChunk> chunks) {
        List<ChatMsg> messages = new ArrayList<>();
        messages.add(new ChatMsg("system", buildSystemPrompt(chunks)));

        for (Message m : history) {
            String role = (m.getRole() == MessageRole.USER) ? "user" : "assistant";
            messages.add(new ChatMsg(role, m.getContent()));
        }

        ChatRequest request = new ChatRequest(model, messages, 0.3);

        try {
            ChatResponse response = openAiWebClient.post()
                    .uri("/chat/completions")
                    .bodyValue(request)
                    .retrieve()
                    .onStatus(HttpStatusCode::is4xxClientError, this::handleClientError)
                    .onStatus(HttpStatusCode::is5xxServerError,
                            r -> Mono.error(new OpenAiException("OpenAI tymczasowo niedostępne")))
                    .bodyToMono(ChatResponse.class)
                    .timeout(Duration.ofSeconds(30))
                    .block();

            if (response == null || response.choices() == null || response.choices().isEmpty()) {
                throw new OpenAiException("Pusta odpowiedź z OpenAI");
            }
            return response.choices().get(0).message().content();

        } catch (WebClientResponseException e) {
            throw new OpenAiException("Błąd OpenAI: " + e.getStatusCode());
        } catch (OpenAiException e) {
            throw e;
        } catch (Exception e) {
            throw new OpenAiException("Nieoczekiwany błąd podczas wywołania OpenAI: " + e.getMessage());
        }
    }

    private Mono<? extends Throwable> handleClientError(ClientResponse response) {
        return response.bodyToMono(String.class)
                .flatMap(body -> Mono.error(new OpenAiException("Niepoprawne zapytanie do OpenAI: " + body)));
    }

    // ОБНОВЛЁН: теперь принимает chunks и вставляет их в промпт
    private String buildSystemPrompt(List<RetrievalService.RetrievedChunk> chunks) {
        String context = chunks.stream()
                .map(c -> "[" + c.section() + "] " + c.content())
                .collect(Collectors.joining("\n\n"));

        return """
                Jesteś asystentem AI strony LABgeneral.pl.
                Odpowiadaj WYŁĄCZNIE na podstawie poniższego kontekstu.
                Jeśli odpowiedzi nie ma w kontekście, powiedz to wprost i zaproponuj kontakt: +48 570 800 890, zapisy@labgeneral.pl.
                Odpowiadaj w języku pytania użytkownika.

                KONTEKST:
                %s
                """.formatted(context.isBlank() ? "(brak dopasowanych fragmentów)" : context);
    }

    private record ChatMsg(String role, String content) {}
    private record ChatRequest(String model, List<ChatMsg> messages, Double temperature) {}
    private record ChatResponse(List<Choice> choices) {
        record Choice(ChatMsg message) {}
    }
}