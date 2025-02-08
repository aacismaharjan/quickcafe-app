package com.example.demo.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {
    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();
    private final Random random = new Random();

    public String generateOtp(String email) {
        String otp = String.valueOf(100000 + random.nextInt(900000));
        otpStorage.put(email, otp);
        return otp;
    }

    public boolean validateOtp(String email, String otp) {
        return otp.equals(otpStorage.get(email));
    }
}
