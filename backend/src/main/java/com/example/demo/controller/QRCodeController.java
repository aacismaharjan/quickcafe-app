package com.example.demo.controller;



import com.example.demo.service.QRCodeService;
import com.google.zxing.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.imageio.ImageIO;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.multipart.MultipartFile;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/api/v1/qrcode")

public class QRCodeController {

    @Autowired
    private QRCodeService qrCodeService;

    @GetMapping
    public void generateQRCode(@RequestParam String text, HttpServletResponse response) throws Exception {
        BufferedImage qrCodeImage = qrCodeService.generateQRCodeImage(text);
        response.setContentType("image/png");
        ImageIO.write(qrCodeImage, "PNG", response.getOutputStream());
    }

    @PostMapping
    public String readQRCode(@RequestParam("file") MultipartFile file) throws IOException, NotFoundException {
        File convFile = new File(System.getProperty("java.io.tmpdir")+"/"+file.getOriginalFilename());
        file.transferTo(convFile);
        return qrCodeService.readQRCode(convFile);
    }
}
