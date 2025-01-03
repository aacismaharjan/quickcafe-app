package com.example.demo.controller;

import com.example.demo.utils.HmacSingatureUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

@Controller
public class HomeController {

    @Value("${esewa}")
    private String secret;

    @GetMapping("/checkout")
    public String index(Model model) {
        String transactionUuid = UUID.randomUUID().toString();
        String message = "total_amount=110,transaction_uuid=" + transactionUuid + ",product_code=EPAYTEST";
        String signature = HmacSingatureUtil.generateSignature("8gBm/:&EnhH.1/q", message);

        model.addAttribute("signature", signature);
        model.addAttribute("transactionUuid", transactionUuid);

        int productId = 1;

        String success_url = "http://localhost:8080/payment-verification/success/" + productId;
        String failure_url = "http://localhost:8080/payment-verification/failure/" + productId;
        model.addAttribute("success_url", success_url);
        model.addAttribute("failure_url", failure_url);
        return "index"; // This will render src/main/resources/templates/index.html
    }


    @GetMapping("/payment-verification/success/{productId}")
    @ResponseBody
    public String verifyPayment(@RequestParam("data") String encodedResponse, @PathVariable int productId) {

    try {
        // Decode the Base64-encoded response
        byte[] decodedBytes = Base64.getDecoder().decode(encodedResponse);
        String decodedResponse = new String(decodedBytes, StandardCharsets.UTF_8);

        // Parse the JSON response
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, String> responseMap = objectMapper.readValue(decodedResponse, Map.class);


        // Verify the signature
        String signedFieldNames = responseMap.get("signed_field_names");
        String[] fields = signedFieldNames.split(",");
        StringBuilder messageBuilder = new StringBuilder();

        for (String field : fields) {
            messageBuilder.append(field).append("=").append(responseMap.get(field)).append(",");
        }

        // Remove the trailing comma
        String message = messageBuilder.substring(0, messageBuilder.length() - 1);
        String signature = responseMap.get("signature");

        boolean isSignatureValid = HmacSingatureUtil.verifySignature(secret, message, signature);

        if (isSignatureValid) {
            // Process the successful payment response
            // You can add your business logic here
            return "Payment verified successfully for product ID: " + productId;
        } else {
            return "Invalid payment signature for product ID: " + productId;
        }
    }catch(Exception e) {
        e.printStackTrace();
        return "Error processing payment verification for product ID: " + productId;
    }
    }
}
