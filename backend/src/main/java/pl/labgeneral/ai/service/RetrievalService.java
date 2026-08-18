package pl.labgeneral.ai.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RetrievalService {

    private static final Logger log = LoggerFactory.getLogger(RetrievalService.class);

    private final WebClient ragWebClient;

    public List<RetrievedChunk> retrieveRelevantChunks(String question, int topK) {
        try {
            SearchRequest request = new SearchRequest(question, topK);

            RetrievedChunk[] response = ragWebClient.post()
                    .uri("/retrieve")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(RetrievedChunk[].class)
                    .timeout(Duration.ofSeconds(10))
                    .block();

            return response == null ? List.of() : Arrays.asList(response);

        } catch (Exception e) {
            log.warn("Usługa RAG niedostępna, kontynuuję bez kontekstu: {}", e.getMessage());
            return List.of();
        }
    }

    private record SearchRequest(String query, int topK) {}
    public record RetrievedChunk(String content, String title, String url, String section) {}
}