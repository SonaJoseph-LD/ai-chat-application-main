package com.example.chat.config;

import com.example.chat.entity.Conversation;
import com.example.chat.entity.Message;
import com.example.chat.entity.User;
import com.example.chat.repository.UserRepository;
import com.example.chat.service.ConversationService;
import com.example.chat.service.MessageService;
import com.example.chat.service.AiClient;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final MessageService messageService;
    private final ConversationService conversationService;
    private final UserRepository userRepository;
    private final AiClient aiClient;
    private final ObjectMapper objectMapper;

    // Track active sessions for each conversation ID
    private final Map<String, Set<WebSocketSession>> conversationSessions = new ConcurrentHashMap<>();

    public ChatWebSocketHandler(MessageService messageService,
                                 ConversationService conversationService,
                                 UserRepository userRepository,
                                 AiClient aiClient,
                                 ObjectMapper objectMapper) {
        this.messageService = messageService;
        this.conversationService = conversationService;
        this.userRepository = userRepository;
        this.aiClient = aiClient;
        this.objectMapper = objectMapper;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // Extract conversationId from query params: ws://localhost:8080/ws-chat?conversationId=1
        String query = session.getUri().getQuery();
        if (query != null && query.contains("conversationId=")) {
            String conversationId = query.split("conversationId=")[1].split("&")[0];
            session.getAttributes().put("conversationId", conversationId);
            conversationSessions.computeIfAbsent(conversationId, k -> Collections.synchronizedSet(new HashSet<>())).add(session);
            System.out.println("WebSocket connection established. Session " + session.getId() + " joined conversation " + conversationId);
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        System.out.println("WebSocket message received: " + payload);

        try {
            WsMessageRequest request = objectMapper.readValue(payload, WsMessageRequest.class);
            String conversationIdStr = (String) session.getAttributes().get("conversationId");
            
            if (conversationIdStr == null) {
                conversationIdStr = String.valueOf(request.getConversationId());
                session.getAttributes().put("conversationId", conversationIdStr);
                conversationSessions.computeIfAbsent(conversationIdStr, k -> Collections.synchronizedSet(new HashSet<>())).add(session);
            }

            User user = userRepository.findById(request.getUserId()).orElse(null);
            if (user == null) {
                sendError(session, "User not found with ID: " + request.getUserId());
                return;
            }

            Conversation conv = conversationService.getConversationById(request.getConversationId());
            if (conv == null) {
                sendError(session, "Conversation not found with ID: " + request.getConversationId());
                return;
            }

            // 1. Save User Message to database
            Message userMessage = new Message();
            userMessage.setContent(request.getContent());
            userMessage.setUser(user);
            userMessage.setConversation(conv);
            Message savedUserMessage = messageService.saveMessage(userMessage);

            // Broadcast the user's message to all users in this conversation
            broadcastMessage(conversationIdStr, savedUserMessage);

            // 2. Call AI Service (FastAPI RAG pipeline)
            String aiResponseText = aiClient.sendMessage(user.getId().toString(), request.getContent());

            // 3. Save AI Message
            User aiUser = userRepository.findByUsername("ai_assistant");
            if (aiUser == null) {
                aiUser = user; 
            }

            Message aiMessage = new Message();
            aiMessage.setContent(aiResponseText);
            aiMessage.setUser(aiUser);
            aiMessage.setConversation(conv);
            Message savedAiMessage = messageService.saveMessage(aiMessage);

            // Broadcast the AI's response to all users in this conversation
            broadcastMessage(conversationIdStr, savedAiMessage);

        } catch (Exception e) {
            e.printStackTrace();
            sendError(session, "Error processing message: " + e.getMessage());
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String conversationId = (String) session.getAttributes().get("conversationId");
        if (conversationId != null) {
            Set<WebSocketSession> sessions = conversationSessions.get(conversationId);
            if (sessions != null) {
                sessions.remove(session);
            }
            System.out.println("WebSocket connection closed. Session " + session.getId() + " left conversation " + conversationId);
        }
    }

    private void broadcastMessage(String conversationId, Message message) {
        Set<WebSocketSession> sessions = conversationSessions.get(conversationId);
        if (sessions != null) {
            String jsonMessage;
            try {
                jsonMessage = objectMapper.writeValueAsString(message);
            } catch (Exception e) {
                return;
            }
            
            synchronized (sessions) {
                for (WebSocketSession s : sessions) {
                    if (s.isOpen()) {
                        try {
                            s.sendMessage(new TextMessage(jsonMessage));
                        } catch (IOException e) {
                            try {
                                s.close();
                            } catch (IOException ex) {
                                // Ignore failure during close
                            }
                        }
                    }
                }
            }
        }
    }

    private void sendError(WebSocketSession session, String errorMsg) throws IOException {
        if (session.isOpen()) {
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(Map.of("error", errorMsg))));
        }
    }

    public static class WsMessageRequest {
        private String content;
        private Long conversationId;
        private Long userId;

        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public Long getConversationId() { return conversationId; }
        public void setConversationId(Long conversationId) { this.conversationId = conversationId; }
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
    }
}
