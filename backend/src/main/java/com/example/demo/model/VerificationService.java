package com.example.demo.model;

import com.example.demo.repository.UserRepository;
import com.example.demo.repository.VerificationRepository;
import com.example.demo.service.EmailService;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class VerificationService {
    private final UserRepository userRepository;
    private final VerificationRepository verificationRepository;
    private final JavaMailSender mailSender;
    private final EmailService emailService;

    public VerificationService(UserRepository userRepository, VerificationRepository verificationRepository, JavaMailSender mailSender, EmailService emailService) {
        this.userRepository = userRepository;
        this.verificationRepository = verificationRepository;
        this.mailSender = mailSender;
        this.emailService = emailService;

    }

    public void sendVerificationEmail(User user) {
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUser(user);
        verificationToken.setExpiryDate(LocalDateTime.now().plusHours(24));
        verificationRepository.save(verificationToken);

        String verificationUrl = "http://localhost:8080/api/v1/auth/activate?token=" + token;
        emailService.sendMail(user.getEmail(), "Verify your account", "Click the link: " + verificationUrl);

    }
}
