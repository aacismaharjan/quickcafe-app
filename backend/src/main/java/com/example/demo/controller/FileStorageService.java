package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String defaultUploadDir;

    /**
     * Saves a file to the specified directory. If no directory is provided, uses the default.
     *
     * @param file       The file to save
     * @param customPath (Optional) The subdirectory within the default upload directory
     * @return The relative file path
     * @throws IOException if file saving fails
     */
    public String saveFile(MultipartFile file, String customPath) {
        // Generate a unique filename
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        // Determine the directory to save the file
        String uploadDirectory = (customPath != null && !customPath.isEmpty())
                ? Paths.get(defaultUploadDir, customPath).toString()
                : defaultUploadDir;

        Path filePath = Paths.get(uploadDirectory, fileName);

        try {
            // Ensure the directory exists
            Files.createDirectories(filePath.getParent());

            // Save the file
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            // Handle file-related exceptions
            throw new RuntimeException("Could not save file " + fileName + ". Please try again!", e);
        }

        return Paths.get(customPath != null ? "uploads/" + customPath :  "uploads/" , fileName).toString().replace("\\", "/");
    }

    /**
     * Overloaded method to save a file using only the default upload directory.
     */
    public String saveFile(MultipartFile file) {
        return saveFile(file, null);
    }
}
