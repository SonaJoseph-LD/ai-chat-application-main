package com.example.chat.controller;

import com.example.chat.service.AuthService;
import com.example.chat.web.dto.AuthDtos;
import com.example.chat.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthDtos.RegisterRequest registerRequest) {
        User registeredUser = authService.register(registerRequest);
        AuthDtos.UserDto userDto = new AuthDtos.UserDto(registeredUser.getId(), registeredUser.getUsername(), registeredUser.getEmail());
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthDtos.LoginRequest loginRequest) {
        User user = authService.login(loginRequest);
        if (user == null) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
        String token = authService.generateTokenFromUser(user);
        AuthDtos.UserDto userDto = new AuthDtos.UserDto(user.getId(), user.getUsername(), user.getEmail());
        return ResponseEntity.ok(new AuthDtos.LoginResponse(token, userDto));
    }
}
