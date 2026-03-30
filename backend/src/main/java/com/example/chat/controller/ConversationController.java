package com.example.chat.controller;

import com.example.chat.entity.Conversation;
import com.example.chat.service.ConversationService;
import com.example.chat.web.dto.ConversationDtos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import java.time.ZoneId;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/conversations")
public class ConversationController {

    private final ConversationService conversationService;

    @Autowired
    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    @GetMapping
    public ResponseEntity<List<ConversationDtos.ConversationResponse>> getAllConversations() {
        List<Conversation> conversations = conversationService.getAllConversations();
        List<ConversationDtos.ConversationResponse> response = conversations.stream()
                .map(conv -> new ConversationDtos.ConversationResponse(
                        conv.getId(),
                        conv.getTitle(),
                        conv.getMessages() != null ? conv.getMessages().stream()
                                .map(msg -> new ConversationDtos.MessageResponse(
                                        msg.getId(),
                                        msg.getContent(),
                                        msg.getUser() != null ? msg.getUser().getUsername() : null,
                                        msg.getTimestamp() != null ? msg.getTimestamp().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli() : null))
                                .collect(Collectors.toList()) : null))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ConversationDtos.ConversationResponse> createConversation(@RequestBody ConversationDtos.CreateConversationRequest createRequest) {
        Conversation conversation = new Conversation();
        conversation.setTitle(createRequest.getTitle());
        // For simplicity, we're not setting the user here, which might cause issues if it's mandatory
        Conversation createdConversation = conversationService.createConversation(conversation);
        
        ConversationDtos.ConversationResponse response = new ConversationDtos.ConversationResponse(
                createdConversation.getId(),
                createdConversation.getTitle(),
                null);
        return ResponseEntity.status(201).body(response);
    }
}