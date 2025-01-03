package com.example.demo.utils;

import com.example.demo.model.User;
import com.example.demo.service.JwtService;
import com.example.demo.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AuthUtil {

    private final JwtService jwtService;
    private final UserService userService;

    @Autowired
    public AuthUtil(JwtService jwtService, UserService userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }

    public User getUserFromRequestToken(HttpServletRequest request) throws Exception {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new Exception("Not authorized");
        }

        try {
            String jwt = authHeader.substring(7);
            String userEmail = jwtService.extractUsername(jwt);
            return userService.getUserByEmail(userEmail);
        } catch (Exception ex) {
            throw new Exception("Unable to extract user from token", ex);
        }
    }

    public Integer getUserIdFromRequestToken(HttpServletRequest request) throws Exception {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new Exception("Not authorized");
        }

        try {
            String jwt = authHeader.substring(7);
            return jwtService.extractUserId(jwt);
        } catch (Exception ex) {
            throw new Exception("Unable to extract user ID from token", ex);
        }
    }
}
