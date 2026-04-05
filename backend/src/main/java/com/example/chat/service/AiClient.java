package com.example.chat.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;

@Service
public class AiClient {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    public AiClient(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public String sendMessage(String userId, String message) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        try {
            // Build request JSON using Map to avoid manual escaping
            java.util.Map<String, String> requestMap = new java.util.HashMap<>();
            requestMap.put("user_id", userId);
            requestMap.put("message", message);
            String requestBody = objectMapper.writeValueAsString(requestMap);
            
            HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> responseEntity = restTemplate.exchange(
                    aiServiceUrl + "/chat",
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );

            // Parse JSON response robustly
            JsonNode root = objectMapper.readTree(responseEntity.getBody());
            if (root.has("response")) {
                return root.get("response").asText();
            }
            return responseEntity.getBody();
        } catch (Exception e) {
            return "Error from AI Service: " + e.getMessage();
        }
    }
}