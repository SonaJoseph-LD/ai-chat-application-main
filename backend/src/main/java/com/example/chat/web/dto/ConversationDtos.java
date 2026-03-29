package com.example.chat.web.dto;

import java.util.List;

public class ConversationDtos {

    public static class ConversationResponse {
        private Long id;
        private String title;
        private List<MessageResponse> messages;

        public ConversationResponse(Long id, String title, List<MessageResponse> messages) {
            this.id = id;
            this.title = title;
            this.messages = messages;
        }

        public Long getId() {
            return id;
        }

        public String getTitle() {
            return title;
        }

        public List<MessageResponse> getMessages() {
            return messages;
        }
    }

    public static class MessageResponse {
        private Long id;
        private String content;
        private String sender;
        private Long timestamp;

        public MessageResponse(Long id, String content, String sender, Long timestamp) {
            this.id = id;
            this.content = content;
            this.sender = sender;
            this.timestamp = timestamp;
        }

        public Long getId() {
            return id;
        }

        public String getContent() {
            return content;
        }

        public String getSender() {
            return sender;
        }

        public Long getTimestamp() {
            return timestamp;
        }
    }

    public static class CreateConversationRequest {
        private String title;

        public CreateConversationRequest(String title) {
            this.title = title;
        }

        public String getTitle() {
            return title;
        }
    }
}