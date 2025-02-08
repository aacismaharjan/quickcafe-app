package com.example.demo.controller;

import com.example.demo.model.Canteen;
import com.example.demo.service.CanteenService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/v1/canteens")
public class CanteenController {
    private final CanteenService canteenService;
    private final FileStorageService fileStorageService;

    @Autowired
    public CanteenController(CanteenService canteenService, FileStorageService fileStorageService) {
        this.canteenService = canteenService;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping
    public ResponseEntity<List<Canteen>> getAllCanteens() {
        List<Canteen> canteens = canteenService.getAllCanteens();
        return ResponseEntity.ok(canteens);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Canteen> getCanteenById(@PathVariable Long id) {
        Optional<Canteen> canteen = canteenService.getCanteenById(id);
        return canteen.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Canteen createCanteen (@RequestBody Canteen canteen) {
        return canteenService.createCanteen(canteen);
    }

    @PatchMapping(value = "/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_OCTET_STREAM_VALUE},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Canteen> updateCanteen(
            @PathVariable Long id,
            @RequestPart("canteenJson") String canteenJson,
            @RequestPart(value = "image_url", required = false) MultipartFile imageFile) {
        try {
            // Convert JSON string to Canteen object
            ObjectMapper objectMapper = new ObjectMapper();
            Canteen canteen = objectMapper.readValue(canteenJson, Canteen.class);

            // If an image is uploaded, save and update the image URL
            if (imageFile != null && !imageFile.isEmpty()) {
                String imagePath = fileStorageService.saveFile(imageFile, "canteen");
                canteen.setImage_url(imagePath);
            }

            // Update the canteen details
            Canteen updatedCanteen = canteenService.updateCanteen(id, canteen);
            return ResponseEntity.ok(updatedCanteen);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCanteen(@PathVariable Long id) {
        try {
            canteenService.deleteCanteen(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
