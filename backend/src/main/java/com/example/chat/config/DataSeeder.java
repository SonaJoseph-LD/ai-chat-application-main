package com.example.chat.config;

import com.example.chat.entity.Conversation;
import com.example.chat.entity.User;
import com.example.chat.repository.ConversationRepository;
import com.example.chat.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, 
                                 ConversationRepository conversationRepository,
                                 PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                User user = new User();
                user.setUsername("testuser");
                user.setEmail("test@example.com");
                user.setPassword(passwordEncoder.encode("password"));
                userRepository.save(user);

                User aiUser = new User();
                aiUser.setUsername("ai_assistant");
                aiUser.setEmail("ai@example.com");
                aiUser.setPassword(passwordEncoder.encode("ai_password"));
                userRepository.save(aiUser);
                
                if (conversationRepository.count() == 0) {
                    Conversation conversation = new Conversation();
                    conversation.setTitle("Default Conversation");
                    conversation.setUser(user);
                    conversationRepository.save(conversation);
                }
            }
        };
    }
}
