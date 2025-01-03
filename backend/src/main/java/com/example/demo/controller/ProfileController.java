package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.service.*;
import com.example.demo.utils.AuthUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.coyote.Response;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import com.example.demo.auth.AuthenticationRequest;

import jakarta.servlet.http.HttpServletRequest;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/profile") // Base mapping for the controller
public class ProfileController {
    private final UserService userService;
    private final FavoriteService favoriteService; 
    private final OrderService orderService;
    private final AuthUtil authUtil;

    @Value("${frontend.server}")
    private String FRONTEND_SERVER;

    private static final String SECRET_KEY = "8gBm/:&EnhH.1/q"; // Your secret key
    
    @Autowired
    public ProfileController(UserService userService, AuthUtil authUtil, FavoriteService favoriteService, OrderService orderService) {
    	this.userService = userService;
    	this.authUtil = authUtil;
    	this.favoriteService = favoriteService;
        this.orderService = orderService;
    }

    @GetMapping
    public User getCurrentUser(@NonNull HttpServletRequest request) throws Exception {
    	return authUtil.getUserFromRequestToken(request);
    }

    @PutMapping
    public User updateCurrentUser(@NonNull HttpServletRequest request, @RequestBody User user) throws Exception {
        Integer userId = authUtil.getUserIdFromRequestToken(request);
        return userService.updateUser(userId, user);
    }

    @GetMapping("/orders")
    public ResponseEntity<Object> getAllOrderByUserId(@NonNull HttpServletRequest request) {
        try {
            User user = authUtil.getUserFromRequestToken(request);
            return ResponseEntity.ok(orderService.getAllOrderByUserId(user.getId()));
        } catch(Exception e) {
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.NOT_FOUND.value(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<Object> getOrderById(@NonNull HttpServletRequest request, @PathVariable Long orderId) {
        try {
            User user = authUtil.getUserFromRequestToken(request);
            Optional<Order> order = orderService.getOrderById(orderId);
            if(order.isPresent() && order.get().getUser().equals(user)) {
                return ResponseEntity.ok(order);
            }else {
                throw new Exception("Didn't find your order.");
            }

        } catch(Exception e) {
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.NOT_FOUND.value(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    public static String generateSignature(Map<String, String> data) throws Exception {
        // Concatenate specified fields
        // signed_field_names -> transaction_code,status,total_amount,transaction_uuid,product_code,signed_field_names
        String signatureInput = "transaction_code=" + data.get("transaction_code") +
                ",status=" + data.get("status") +
                ",total_amount=" + data.get("total_amount") +
                ",transaction_uuid=" + data.get("transaction_uuid") +
                ",product_code=" + data.get("product_code") +
                ",signed_field_names=" + data.get("signed_field_names");

        // Generate HMAC-SHA256 hash
        SecretKeySpec keySpec = new SecretKeySpec(SECRET_KEY.getBytes(), "HmacSHA256");
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(keySpec);
        byte[] hmacBytes = mac.doFinal(signatureInput.getBytes());

        // Encode the result as Base64
        return Base64.getEncoder().encodeToString(hmacBytes);
    }


    @GetMapping("/orders/{orderId}/checkout")
    public ResponseEntity<String> handleCheckout(@PathVariable Long orderId, @RequestParam("data") String encodedResponse) {
       try {
           // Step 1: Decode the Base64 response
           byte[] deocdedBytes = Base64.getDecoder().decode(encodedResponse);
           System.out.println(Arrays.toString(deocdedBytes));
           String decodedResponse = new String(deocdedBytes, StandardCharsets.UTF_8);

           // Step 2: Parse JSON response
           ObjectMapper objectMapper = new ObjectMapper();
           Map<String, String> responseData;
           try {
               responseData = objectMapper.readValue(decodedResponse, new TypeReference<Map<String, String>>() {});
           }catch(JsonProcessingException e) {
               return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid response data");
           }

           // Step 3: Verify the signature
           String expectedSignature = generateSignature(responseData); // Implement this based on your setup
           if (!expectedSignature.equals(responseData.get("signature"))) {
               return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Signature verification failed");
           }

           // Step 4: Update Order Status based on Payment Response
           String status = responseData.get("status");
           if ("COMPLETE".equals(status)) {
               Order order = orderService.getOrderById(orderId).orElseThrow(()-> new RuntimeException(("Couldn't find.")));
               if (order != null) {
                   order.setPaymentStatus(PaymentStatus.COMPLETED); // 1 for Paid
                   order.setOrderStatus("Confirmed");
                   orderService.updateOrder(order.getId(), order);
//                   return ResponseEntity.ok("Order updated successfully");

                   // Redirect to the React app's /order-confirmation page
                   URI redirectUri = URI.create(FRONTEND_SERVER + "/order-confirmation?orderId=" + order.getId());
                   return ResponseEntity.status(HttpStatus.SEE_OTHER).location(redirectUri).build();
               } else {
                   return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
               }
           }

           return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payment not completed");
       }catch(Exception e) {
           return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
       }
    }

    @PostMapping("/orders")
    public ResponseEntity<Order> createOrder(@NonNull HttpServletRequest request, @RequestBody Order order) {
        try {
            User user = authUtil.getUserFromRequestToken(request);
            order.setUser(user);
            return ResponseEntity.ok(orderService.createOrder(order));
        }catch(Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/orders/{orderId}")
    public ResponseEntity<Object> updateOrder(@NonNull HttpServletRequest request, @PathVariable Long orderId, @RequestBody Order order) {
        try {
            User user = authUtil.getUserFromRequestToken(request);
            Optional<Order> fetchedOrder = orderService.getOrderById(orderId);
            if(fetchedOrder.isPresent() && fetchedOrder.get().getUser().equals(user)) {
                orderService.updateOrder(orderId, order);
                return ResponseEntity.ok(order);
            }else {
                throw new Exception("Didn't find your order.");
            }

        } catch(Exception e) {
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.NOT_FOUND.value(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @DeleteMapping("/orders/{orderId}")
    public ResponseEntity<Object> deleteOrder(@NonNull HttpServletRequest request, @PathVariable Long orderId) {
        try {
            int userId = authUtil.getUserIdFromRequestToken(request);
            Optional<Order> fetchedOrder = orderService.getOrderById(orderId);
            if(fetchedOrder.isPresent() && fetchedOrder.get().getUser().getId() == userId) {
                orderService.deleteOrder(orderId);
                return ResponseEntity.noContent().build();
            }else {
                throw new Exception("Didn't find your order.");
            }

        } catch(Exception e) {
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.NOT_FOUND.value(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }


    
    @GetMapping(path = "/favorites")
    public List<Favorite> getAllFavorite(@NonNull HttpServletRequest request) throws Exception {
    	Integer userId = authUtil.getUserIdFromRequestToken(request);
        return favoriteService.getAllFavoriteByUserId(userId);
    }

    @PostMapping("/favorites")
    public ResponseEntity<Favorite> addMenuItemToFavorite(@NonNull HttpServletRequest request, @RequestBody Favorite favorite) {
        try {
            User user = authUtil.getUserFromRequestToken(request);
            favorite.setUser(user);
            return ResponseEntity.ok(favoriteService.createFavorite(favorite));
        }catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/favorites/{menuItemId}")
    public ResponseEntity<String> removeMenuItemFromFavorite(@NonNull HttpServletRequest request, @PathVariable Long menuItemId) {
        try {
            Integer userId = authUtil.getUserIdFromRequestToken(request);
            favoriteService.deleteFavoriteByUserIdAndMenuItemId(userId, menuItemId);
            return ResponseEntity.noContent().build();
        }catch(Exception e) {
            return ResponseEntity.badRequest().body("Unable to do UnFavorite: " + e.getMessage());
        }
    }
}
