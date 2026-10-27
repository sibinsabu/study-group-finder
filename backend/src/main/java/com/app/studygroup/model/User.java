package com.app.studygroup.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * User Entity representing a student or mentor in the Study Group Finder application.
 * Implements Serializable for robust HttpSession session tracking across server contexts.
 * Addresses Phase 1 (Core Application Setup and Design):
 * - User entity with attributes (username, password, email, etc.)
 * - Class structure with constructors, encapsulation, and methods.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    // Display Name
    private String name;

    // Username attribute (as per MCA syllabus requirement)
    @Indexed(unique = true, sparse = true)
    private String username;

    @Indexed(unique = true)
    private String email;

    // Encrypted password credential
    private String password;

    private String university;

    private String avatar;

    @Builder.Default
    private String role = "student"; // "student" or "mentor"

    private String expertise; // For mentors: e.g. "Computer Science, Data Structures"

    private String title; // For mentors: e.g. "Senior Peer Mentor", "TA"

    private String bio;

    private Integer experienceYears;

    private String linkedInOrWebsite;

    @Builder.Default
    private Double rating = 5.0;

    @Builder.Default
    private List<String> joinedGroups = new ArrayList<>();

    @Builder.Default
    private List<String> privileges = new ArrayList<>();

    @CreatedDate
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public boolean isAdmin() {
        return "admin".equalsIgnoreCase(this.role);
    }

    /**
     * Parameterized constructor for basic User initialization (Phase 1).
     */
    public User(String username, String email, String password) {
        this.username = username;
        this.name = username;
        this.email = email;
        this.password = password;
        this.role = "student";
        this.joinedGroups = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
    }

    /**
     * Parameterized constructor with name, email, password, and role.
     */
    public User(String name, String username, String email, String password, String role) {
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role != null ? role : "student";
        this.joinedGroups = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
    }

    /**
     * Helper to retrieve active username or fallback to email.
     */
    public String getEffectiveUsername() {
        if (username != null && !username.isBlank()) {
            return username;
        }
        if (email != null && !email.isBlank()) {
            return email;
        }
        return name;
    }
}
