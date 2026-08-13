package pl.labgeneral.ai.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RetrievalService {

    private final WebClient ragWebClient;

    public List<RetrievedChunk> retrieveRelevantChunks(String question, int topK) {
        SearchRequest request = new SearchRequest(question, topK);

        RetrievedChunk[] response = ragWebClient.post()
                .uri("/retrieve")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(RetrievedChunk[].class)
                .timeout(Duration.ofSeconds(10))
                .doOnNext(r -> System.out.println("RAG RESULT: " + Arrays.toString(r)))
                .doOnError(e -> System.err.println("RAG ERROR: " + e.getMessage()))
                .block();

        return response == null ? List.of() : Arrays.asList(response);
    }

    private record SearchRequest(String query, int topK) {}
    public record RetrievedChunk(String content, String title, String url, String section) {}
}