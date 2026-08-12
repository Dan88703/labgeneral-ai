package pl.labgeneral.ai.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@RequiredArgsConstructor
@Configuration
public class OpenAiConfig {

    @Value("${openai.base-url}")
    private String baseUrl;

    @Value("${openai.api-key}")
    private String apiKey;

    @PostConstruct
    public void debugKey() {
        System.out.println("=== DEBUG KEY ===");
        System.out.println("Length: " + apiKey.length());
        System.out.println("Start: [" + apiKey.substring(0, Math.min(8, apiKey.length())) + "]");
        System.out.println("End: [" + apiKey.substring(Math.max(0, apiKey.length() - 4)) + "]");
        System.out.println("=================");
    }

    @Bean
    public WebClient openAiWebClient() {
        return WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }
}