package com.example.chat.controller;

import com.example.chat.entity.Conversation;
import com.example.chat.service.ConversationService;
import com.example.chat.web.dto.ConversationDtos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/conversations")
public class ConversationController {

    private final ConversationService conversationService;

    @Autowired
    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    @GetMapping
    public ResponseEntity<List<ConversationDtos>> getAllConversations() {
        List<ConversationDtos> conversations = conversationService.getAllConversations();
        return ResponseEntity.ok(conversations);
    }

    @PostMapping
    public ResponseEntity<ConversationDtos> createConversation(@RequestBody ConversationDtos conversationDto) {
        ConversationDtos createdConversation = conversationService.createConversation(conversationDto);
        return ResponseEntity.status(201).body(createdConversation);
    }
}