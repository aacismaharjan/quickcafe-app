package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
public class CanteenDemoApplication {
	public static void main(String[] args) {
		SpringApplication.run(CanteenDemoApplication.class, args);
	}
}
// lombok