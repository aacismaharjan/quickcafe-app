package com.example.demo.utils;

import com.example.demo.model.Role;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

//@Component // Remove or comment this annotation
public class DataSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public DataSeeder(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        Role userRole = roleRepository.findByName("ROLE_USER").orElseGet(()-> {
            Role role = new Role("ROLE_USER");
            return roleRepository.save(role);
        });

        // Ensure roles exists
        Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseGet(() -> {
            Role role = new Role("ROLE_ADMIN");
            return roleRepository.save(role);
        });

        Role ownerRole = roleRepository.findByName("ROLE_OWNER").orElseGet(()-> {
            Role role = new Role("ROLE_OWNER");
            return roleRepository.save(role);
        });

        userRepository.findById(302).ifPresent(user -> {
            Set<Role> userRoles = new HashSet<>(user.getRoles());
            userRoles.add(userRole);
            userRoles.add(adminRole);
            userRoles.add(ownerRole);
            user.setRoles(userRoles);
            userRepository.save(user);
            System.out.println("Roles updated for User ID 1.");
        });
    }
}
