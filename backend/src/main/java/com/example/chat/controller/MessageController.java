package com.example.chat.controller;

import com.example.chat.entity.Message;
import com.example.chat.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
public class MessageController {

    private final MessageService messageService;
    private final com.example.chat.service.ConversationService conversationService;
    private final com.example.chat.repository.UserRepository userRepository;
    private final com.example.chat.service.AiClient aiClient;

    @Autowired
    public MessageController(MessageService messageService,
                             com.example.chat.service.ConversationService conversationService,
                             com.example.chat.repository.UserRepository userRepository,
                             com.example.chat.service.AiClient aiClient) {
        this.messageService = messageService;
        this.conversationService = conversationService;
        this.userRepository = userRepository;
        this.aiClient = aiClient;
    }

    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestBody MessageRequest request) {
        com.example.chat.entity.User user = userRepository.findById(request.getUserId()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found with ID: " + request.getUserId());
        }

        com.example.chat.entity.Conversation conv = conversationService.getConversationById(request.getConversationId());
        if (conv == null) {
            return ResponseEntity.badRequest().body("Conversation not found with ID: " + request.getConversationId());
        }

        // 1. Save User Message
        Message userMessage = new Message();
        userMessage.setContent(request.getContent());
        userMessage.setUser(user);
        userMessage.setConversation(conv);
        messageService.saveMessage(userMessage);

        try {
            // 2. Call AI Service
            String aiResponseText = aiClient.sendMessage(user.getId().toString(), request.getContent());

            // 3. Save AI Message
            com.example.chat.entity.User aiUser = userRepository.findByUsername("ai_assistant");
            if (aiUser == null) {
                // Fallback or create if missing (though DataSeeder should handle it)
                aiUser = user; 
            }

            Message aiMessage = new Message();
            aiMessage.setContent(aiResponseText);
            aiMessage.setUser(aiUser);
            aiMessage.setConversation(conv);

            Message savedAiMessage = messageService.saveMessage(aiMessage);

            // Return the AI's message so the frontend can display it
            return ResponseEntity.ok(savedAiMessage);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error processing AI response: " + e.getMessage());
        }
    }
    public static class MessageRequest {
        private String content;
        private Long conversationId;
        private Long userId;

        // Getters and Setters
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public Long getConversationId() { return conversationId; }
        public void setConversationId(Long conversationId) { this.conversationId = conversationId; }
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
    }

    @GetMapping("/{conversationId}")
    public ResponseEntity<List<Message>> getMessages(@PathVariable Long conversationId) {
        List<Message> messages = messageService.getMessagesByConversationId(conversationId);
        return ResponseEntity.ok(messages);
    }
}