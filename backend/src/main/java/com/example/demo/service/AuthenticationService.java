package com.example.demo.service;

import com.example.demo.auth.AuthenticationRequest;
import com.example.demo.auth.AuthenticationResponse;
import com.example.demo.auth.RegisterRequest;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.model.VerificationService;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;


@Service
@AllArgsConstructor

public class AuthenticationService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RoleRepository roleRepository;
   private final VerificationService verificationService;

    private final EmailService emailService;
    private final OtpService otpService;

    public void sendOtp(String email) {
        String otp = otpService.generateOtp(email);

        // Send OTP via email (implement email sending logic)
        String subject = "Your OTP Code";
        String body = "Your OTP for password reset is: " + otp;
        emailService.sendMail(email, subject, body);
        System.out.println("OTP for " + email + ": " + otp);
    }

    public boolean verifyOtp (String email, String otp) {
        return otpService.validateOtp(email, otp);
    }

    public void updatePassword(String email, String newPassword) {
        User user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        repository.save(user);

    }

    // Get the currently authenticated user's email
    public String getCurrentUserEmail() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            return authentication.getName();  // The username is typically the email
        }
        throw new RuntimeException("User is not authenticated");
    }

    // Verify if the provided password matches the stored password (hashed)
    public boolean verifyPassword(String email, String password) {
        User user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return passwordEncoder.matches(password, user.getPassword());
    }

    @Transactional
    public AuthenticationResponse register(RegisterRequest request) {

        if(repository.findByEmail(request.getEmail()).isPresent()) {
//            return ResponseEntity.badRequest().body("Email already in use");
            throw new RuntimeException("Email already in use");
        }


        // Get or create the default role "USER"
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_USER")));


        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(new HashSet<>(Collections.singletonList(userRole)))
                .enabled(false)
                .build();
        User savedUser = repository.save(user);

        verificationService.sendVerificationEmail(savedUser);


        var jwtToken = jwtService.generateAccessToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .user(savedUser)
                .build();
    }



    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = repository.findByEmail(request.getEmail()).orElseThrow();
        var jwtToken = jwtService.generateAccessToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .user(user)
                .build();
    }
}
