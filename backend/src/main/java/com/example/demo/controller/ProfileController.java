package com.example.demo.controller;

import com.example.demo.auth.ResponseWrapper;
import com.example.demo.model.*;
import com.example.demo.service.*;
import com.example.demo.utils.AuthUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.multipart.MultipartFile;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/api/v1/profile") // Base mapping for the controller
public class ProfileController {
    private final UserService userService;
    private final FavoriteService favoriteService; 
    private final OrderService orderService;
    private final AuthUtil authUtil;
    private final FileStorageService fileStorageService;
    private final CanteenService canteenService;
    private final EntityManager entityManager;

    @Value("${frontend.server}")
    private String FRONTEND_SERVER;

    private static final String SECRET_KEY = "8gBm/:&EnhH.1/q"; // Your secret key
    
    @Autowired
    public ProfileController(UserService userService, AuthUtil authUtil, FavoriteService favoriteService, OrderService orderService, FileStorageService fileStorageService, CanteenService canteenService, EntityManager entityManager) {
    	this.userService = userService;
    	this.authUtil = authUtil;
    	this.favoriteService = favoriteService;
        this.orderService = orderService;
        this.fileStorageService = fileStorageService;
        this.canteenService = canteenService;
        this.entityManager = entityManager;
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

    @PatchMapping
    public ResponseEntity<User> updateCurrentUser(
            @NonNull HttpServletRequest request,
            @RequestPart("profileJson") String profileJson,
            @RequestPart(value = "image_url", required = false) MultipartFile imageFile) {
        try {
            Integer userId = authUtil.getUserIdFromRequestToken(request);

            // Convert JSON string to User object
            ObjectMapper objectMapper = new ObjectMapper();
            User user = objectMapper.readValue(profileJson, User.class);

            // If an image is uploaded, save and update the image URL
            if (imageFile != null && !imageFile.isEmpty()) {
                String imagePath = fileStorageService.saveFile(imageFile, "profile");
                user.setImage_url(imagePath);
            }

            // Update the user details
            User updatedUser = userService.partiallyUpdateUser(userId, user);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/orders")
    public ResponseEntity<Object> getAllOrderByUserId(@NonNull HttpServletRequest request) {
        try {
            User user = authUtil.getUserFromRequestToken(request);
            List<Order> orders = orderService.getAllOrderByUserId(user.getId());
            return ResponseEntity.ok(orders);
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
    public ResponseEntity<?> handleCheckout(@PathVariable Long orderId,
                                            @RequestParam(value = "data", required = false) String encodedResponse) {
        try {
            // Step 1: Handle the case where "data" is missing
            if (encodedResponse == null || encodedResponse.isEmpty()) {
                String errorMessage = "Payment not completed.";
                URI redirectUri = URI.create(FRONTEND_SERVER + "/order-confirmation?orderId=" + orderId + "&error=true&message="
                        + URLEncoder.encode(errorMessage, StandardCharsets.UTF_8));
                return ResponseEntity.status(HttpStatus.SEE_OTHER).location(redirectUri).build();
            }

            // Step 2: Decode the Base64 response
            byte[] decodedBytes = Base64.getDecoder().decode(encodedResponse);
            String decodedResponse = new String(decodedBytes, StandardCharsets.UTF_8);

            // Step 3: Parse the decoded JSON response
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, String> responseData;
            try {
                responseData = objectMapper.readValue(decodedResponse, new TypeReference<Map<String, String>>() {});
            } catch (JsonProcessingException e) {
                String errorMessage = "Invalid response data.";
                URI redirectUri = URI.create(FRONTEND_SERVER + "/order-confirmation?orderId=" + orderId + "&error=true&message="
                        + URLEncoder.encode(errorMessage, StandardCharsets.UTF_8));
                return ResponseEntity.status(HttpStatus.SEE_OTHER).location(redirectUri).build();
            }

            // Step 4: Verify the signature
            String expectedSignature = generateSignature(responseData);
            if (!expectedSignature.equals(responseData.get("signature"))) {
                String errorMessage = "Signature verification failed.";
                URI redirectUri = URI.create(FRONTEND_SERVER + "/order-confirmation?orderId=" + orderId + "&error=true&message="
                        + URLEncoder.encode(errorMessage, StandardCharsets.UTF_8));
                return ResponseEntity.status(HttpStatus.SEE_OTHER).location(redirectUri).build();
            }

            // Step 5: Update Order Status based on Payment Response
            String status = responseData.get("status");
            if ("COMPLETE".equals(status)) {
                // Process successful payment
                Order order = orderService.getOrderById(orderId).orElseThrow(() -> new RuntimeException("Couldn't find order."));
                order.setPaymentStatus(PaymentStatus.PAID);  // 1 for Paid
                order.setOrderStatus(OrderStatus.RECEIVED);
                orderService.updateOrder(order.getId(), order);

                URI redirectUri = URI.create(FRONTEND_SERVER + "/order-confirmation?orderId=" + order.getId()
                        + "&paymentStatus=" + status + "&error=false");
                return ResponseEntity.status(HttpStatus.SEE_OTHER).location(redirectUri).build();
            }

            // Handle payment not completed
            String errorMessage = "Payment not completed.";
            URI redirectUri = URI.create(FRONTEND_SERVER + "/order-confirmation?orderId=" + orderId + "&paymentStatus=" + status
                    + "&error=true&message=" + URLEncoder.encode(errorMessage, StandardCharsets.UTF_8));
            return ResponseEntity.status(HttpStatus.SEE_OTHER).location(redirectUri).build();
        } catch (Exception e) {
            // Handle unexpected exceptions
            String errorMessage = "An unexpected error occurred during the checkout process.";
            URI redirectUri = URI.create(FRONTEND_SERVER + "/order-confirmation?orderId=" + orderId + "&error=true&message="
                    + URLEncoder.encode(errorMessage, StandardCharsets.UTF_8));
            return ResponseEntity.status(HttpStatus.SEE_OTHER).location(redirectUri).build();
        }
    }



    @PostMapping("/orders")
    public ResponseEntity<Order> createOrder(@NonNull HttpServletRequest request, @RequestBody Order order) {
        try {
            User user = authUtil.getUserFromRequestToken(request);

            Canteen canteen = canteenService.getCanteenById(order.getCanteen().getId())
                    .orElseThrow(() -> new RuntimeException("Canteen not found with id: " + order.getCanteen().getId()));

            order.setUser(user);
            order.setCanteen(canteen);
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

    @GetMapping(path = "/canteen")
    public ResponseEntity<?> getMyCanteen(@NonNull HttpServletRequest request) throws Exception {
        try {
            Integer userId = authUtil.getUserIdFromRequestToken(request);
            Canteen canteen = canteenService.getCanteenByUserId(userId);
            return ResponseEntity.ok(canteen);
        }catch(Exception ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseWrapper<Void>(false, ex.getMessage()));
        }
    }


}
