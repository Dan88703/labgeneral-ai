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

        System.out.println("=== RAG REQUEST ===");
        System.out.println("Question: " + question);
        System.out.println("TopK: " + topK);

        try {
            SearchRequest request = new SearchRequest(question, topK);

            RetrievedChunk[] response = ragWebClient.post()
                    .uri("/retrieve")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(RetrievedChunk[].class)
                    .timeout(Duration.ofSeconds(10))
                    .block();

            System.out.println("=== RAG RESULT ===");
            System.out.println("Chunks: " + (response == null ? 0 : response.length));

            return response == null
                    ? List.of()
                    : Arrays.asList(response);

        } catch (Exception e) {

            System.out.println("=== RAG ERROR ===");
            System.out.println("Error class: " + e.getClass().getName());
            System.out.println("Error message: " + e.getMessage());
            e.printStackTrace();

            throw e;
        }
    }

    private record SearchRequest(String query, int topK) {}
    public record RetrievedChunk(String content, String title, String url, String section) {}
}