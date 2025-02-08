package com.example.demo.controller;

import com.example.demo.auth.ResponseWrapper;
import com.example.demo.dto.OtpVerificationRequest;
import com.example.demo.dto.PasswordResetRequest;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.AuthenticationService;
import com.example.demo.service.UserService;
import jakarta.validation.Valid;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class PasswordResetController {
    private final AuthenticationService authService;
    private final UserRepository userRepository;



    @PostMapping("/request-reset")
    public ResponseEntity<ResponseWrapper<Void>> requestPasswordReset(@RequestBody PasswordResetRequest request) {
        // Check if the user exists (assuming findByEmail is available in your UserRepository)
        boolean userExists = userRepository.findByEmail(request.getEmail()).isPresent();

        // If the user does not exist, return an error response
        if (!userExists) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseWrapper<>(false, "User with this email does not exist"));
        }

        // Send OTP if user exists
        authService.sendOtp(request.getEmail());

        // Return success response
        return ResponseEntity.ok(new ResponseWrapper<>(true, "OTP sent to email"));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ResponseWrapper<Void>> verifyOtp(@RequestBody OtpVerificationRequest request) {
        boolean otpValid = authService.verifyOtp(request.getEmail(), request.getOtp());

        if (otpValid) {
            return ResponseEntity.ok(new ResponseWrapper<>(true, "OTP verified"));
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ResponseWrapper<>(false, "Invalid OTP"));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ResponseWrapper<Void>> changePassword(@Valid @RequestBody PasswordChangeRequest request) {
        String email = authService.getCurrentUserEmail();

        boolean oldPasswordValid = authService.verifyPassword(email, request.getOldPassword());

        if(!oldPasswordValid) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseWrapper<>(false, "Incorrect old password"));
        }

        if(!request.getNewPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseWrapper<>(false, "New password and confirmation password do not match."));
        }

        // Update the password
        authService.updatePassword(email, request.getNewPassword());

        // Return success response
        return ResponseEntity.ok(new ResponseWrapper<>(true, "Password updated successfully."));

    }




    @PostMapping("/reset-password")
    public ResponseEntity<ResponseWrapper<Void>> resetPassword(@Valid @RequestBody PasswordResetRequest request) {

        boolean otpValid = authService.verifyOtp(request.getEmail(), request.getOtp());

        if(!otpValid) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseWrapper<>(false, "Invalid OTP. Please try again."));
        }

        // Check if the new password and confirm password match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseWrapper<>(false, "Passwords do not match"));
        }

        // Reset the password
        authService.updatePassword(request.getEmail(), request.getNewPassword());

        // Return success response
        return ResponseEntity.ok(new ResponseWrapper<>(true, "Password updated successfully"));
    }
}

@Getter
@Setter
class PasswordChangeRequest {
    private String oldPassword;
    private String newPassword;
    private String confirmPassword;
}