package pl.labgeneral.ai.service;

import org.springframework.stereotype.Service;

@Service
public class AiService {

    public String generateResponse(String userMessage) {
        return "To jest testowa odpowiedź AI na: " + userMessage;
    }
}