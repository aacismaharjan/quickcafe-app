package com.example.demo.utils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import lombok.NoArgsConstructor;
import org.apache.commons.codec.binary.Base64;

@NoArgsConstructor
public class HmacSingatureUtil {
    public static String generateSignature(String secret, String message) {
        try {
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
            sha256_HMAC.init(secret_key);
            return Base64.encodeBase64String(sha256_HMAC.doFinal(message.getBytes()));
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate signature: " + e.getMessage());
        }
    }

    public static boolean verifySignature(String secret, String message, String signature) {
        String generatedSignature = generateSignature(secret, message);
        return generatedSignature.equals(signature);
    }
}