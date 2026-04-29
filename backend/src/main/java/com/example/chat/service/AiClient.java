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

import org.springframework.core.io.FileSystemResource;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;

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

    public String uploadFile(String userId, MultipartFile file) {
        try {
            // Create a temporary file to hold the multipart content
            Path tempFile = Files.createTempFile("upload-", file.getOriginalFilename());
            file.transferTo(tempFile.toFile());

            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "multipart/form-data");

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("user_id", userId);
            body.add("file", new FileSystemResource(tempFile.toFile()));

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<String> responseEntity = restTemplate.exchange(
                    aiServiceUrl + "/upload",
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );

            // Clean up temp file
            Files.deleteIfExists(tempFile);

            return responseEntity.getBody();
        } catch (Exception e) {
            return "Error uploading file to AI Service: " + e.getMessage();
        }
    }
}