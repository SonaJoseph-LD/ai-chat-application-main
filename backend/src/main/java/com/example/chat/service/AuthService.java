package com.example.chat.service;

import com.example.chat.entity.User;
import com.example.chat.repository.UserRepository;
import com.example.chat.web.dto.AuthDtos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.example.chat.config.JwtConfig jwtConfig;

    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, com.example.chat.config.JwtConfig jwtConfig) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtConfig = jwtConfig;
    }

    public String generateToken(org.springframework.security.core.Authentication authentication) {
        return jwtConfig.generateToken(authentication.getName());
    }

    public String generateTokenFromUser(User user) {
        return jwtConfig.generateToken(user.getEmail()); // Using email as the subject
    }

    @Transactional
    public User register(AuthDtos.RegisterRequest registerRequest) {
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        return userRepository.save(user);
    }

    public User login(AuthDtos.LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail());
        if (user != null && passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return user;
        }
        return null;
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}