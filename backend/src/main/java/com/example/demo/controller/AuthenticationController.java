package com.example.demo.controller;

import com.example.demo.auth.AuthenticationRequest;
import com.example.demo.auth.AuthenticationResponse;
import com.example.demo.auth.ResponseWrapper;
import com.example.demo.model.User;
import com.example.demo.model.VerificationToken;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.VerificationRepository;
import com.example.demo.service.AuthenticationService;
import com.example.demo.auth.RegisterRequest;
import com.example.demo.service.JwtService;
import lombok.AllArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")

public class AuthenticationController {

    private final AuthenticationService service;
    private final UserRepository userRepository;
    private final VerificationRepository verificationRepository;
    private final JwtService jwtService;

    @Value("${frontend.server}")
    private String frontendUrl;

    @Autowired
    public AuthenticationController(UserRepository userRepository, AuthenticationService authenticationService, VerificationRepository verificationRepository, JwtService jwtService) {
        this.service = authenticationService;
        this.verificationRepository = verificationRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register (@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(service.register(request));
    }

    @GetMapping("/activate")
    public ResponseEntity<String> verifyAccount(@RequestParam String token) {
        VerificationToken verificationToken = verificationRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired Token"));

        User user = verificationToken.getUser();
        user.setEnabled(true);
        userRepository.save(user);
        verificationRepository.delete(verificationToken);

        return ResponseEntity.ok("Account verified successfully. Now, you can log back in.");
    }


    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate (@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @PostMapping("/verify")
    public ResponseEntity<ResponseWrapper<Void>> verifyToken(@RequestBody Map<String, String> payload) {
        String token = payload.get("accessToken");

        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(400).body(new ResponseWrapper<>(false, "Token is required"));
        }

        // Remove "Bearer " prefix if it exists
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        if (jwtService.isTokenValid(token)) {
            return ResponseEntity.ok(new ResponseWrapper<>(true, "Token is valid."));
        } else {
            return ResponseEntity.status(401).body(new ResponseWrapper<>(false, "Invalid or expired token"));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(@RequestBody Map<String, String> payload) {
        String refreshToken = payload.get("refreshToken");

        if(refreshToken == null || !jwtService.isTokenValid(refreshToken)) {
            return ResponseEntity.status(400).body(new ResponseWrapper<>(false, "Invalid or expired refresh token"));
        }

        String username = jwtService.extractUsername(refreshToken);
        User user = userRepository.findByEmail(username).orElseThrow(() ->
                new RuntimeException("Invalid refresh token."));
        if(user == null) {
            return ResponseEntity.status(400).body(new ResponseWrapper<>(false, "Invalid refresh token"));
        }

        String newAccessToken = jwtService.generateAccessToken(user);
        AuthenticationResponse response = new AuthenticationResponse();
        return ResponseEntity.ok(new AuthenticationResponse(newAccessToken, refreshToken, user));
    }
}
