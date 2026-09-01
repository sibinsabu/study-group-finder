package com.app.studygroup.service;

import com.app.studygroup.dto.AuthResponse;
import com.app.studygroup.dto.LoginRequest;
import com.app.studygroup.dto.RegisterRequest;
import com.app.studygroup.dto.UserDto;
import com.app.studygroup.model.User;
import com.app.studygroup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        // Check for duplicate email in MongoDB
        if (userRepository.existsByEmail(normalizedEmail)) {
            return AuthResponse.builder()
                    .success(false)
                    .message("An account with email " + normalizedEmail + " already exists.")
                    .build();
        }

        // Infer university from email domain if not specified
        String university = request.getUniversity();
        if (university == null || university.isBlank()) {
            if (normalizedEmail.contains("@") && normalizedEmail.contains(".edu")) {
                String domain = normalizedEmail.substring(normalizedEmail.indexOf("@") + 1);
                university = domain.replace(".edu", "").toUpperCase();
            } else {
                university = "University Scholar";
            }
        }

        // Default student avatar pool
        String avatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80";

        // Create new User entity with hashed password
        User newUser = User.builder()
                .name(request.getName().trim())
                .email(normalizedEmail)
                .password(passwordEncoder.encode(request.getPassword()))
                .university(university)
                .avatar(avatar)
                .joinedGroups(new ArrayList<>(List.of("1", "2"))) // Default 2 popular circles enrolled
                .createdAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(newUser);

        return AuthResponse.builder()
                .success(true)
                .message("Registration successful! Welcome to StudySphere.")
                .user(UserDto.fromEntity(savedUser))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        Optional<User> optionalUser = userRepository.findByEmail(normalizedEmail);
        if (optionalUser.isEmpty()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("No account found with email: " + normalizedEmail)
                    .build();
        }

        User user = optionalUser.get();

        // Verify password against BCrypt hash in MongoDB
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Invalid password credentials. Please try again.")
                    .build();
        }

        return AuthResponse.builder()
                .success(true)
                .message("Login successful! Welcome back, " + user.getName() + ".")
                .user(UserDto.fromEntity(user))
                .build();
    }

    public Optional<UserDto> getUserById(String id) {
        return userRepository.findById(id).map(UserDto::fromEntity);
    }

    public Optional<UserDto> getUserByEmail(String email) {
        return userRepository.findByEmail(email.trim().toLowerCase()).map(UserDto::fromEntity);
    }

    public UserDto updateJoinedGroups(String userId, List<String> groupIds) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        user.setJoinedGroups(groupIds);
        User updated = userRepository.save(user);
        return UserDto.fromEntity(updated);
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserDto::fromEntity)
                .toList();
    }
}
