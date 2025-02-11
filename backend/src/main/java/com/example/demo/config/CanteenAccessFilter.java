package com.example.demo.config;

import com.example.demo.service.CanteenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
//
//@Component
//public class CanteenAccessFilter extends OncePerRequestFilter {
//
//    @Autowired
//    private CanteenService canteenService;
//
//    @Override
//    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
//            throws ServletException, IOException {
//
//        // Extract canteenId from the URL
//        String[] pathSegments = request.getRequestURI().split("/");
//        Long canteenId = Long.parseLong(pathSegments[4]);
//
//        // Get user authentication information from the request
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (authentication != null) {
//            Integer userId = Integer.valueOf(authentication.getName());
//
//            // Check if user is authorized to perform actions on this canteen
//            if (request.getMethod().equals("POST") || request.getMethod().equals("PATCH") || request.getMethod().equals("DELETE")) {
//                if (!canteenService.isUserOwnerOfCanteen(userId, canteenId)) {
//                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
//                    response.getWriter().write("Access Denied: You must be an owner to perform this action.");
//                    return;
//                }
//            }
//        }
//
//        // Continue processing the request if all checks pass
//        filterChain.doFilter(request, response);
//    }
//}