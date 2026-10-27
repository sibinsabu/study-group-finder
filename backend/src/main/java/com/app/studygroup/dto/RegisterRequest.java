package com.app.studygroup.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    private String name;
    private String username;
    private String email;
    private String password;
    private String university;
    private String role; // "student" or "mentor"
    private String expertise; // For mentor: e.g. "Data Structures, AI"
    private String title; // For mentor: e.g. "Senior Peer Mentor"
    private String bio;
    private Integer experienceYears;
    private String linkedInOrWebsite;

    public String getEffectiveUsername() {
        if (username != null && !username.isBlank()) {
            return username.trim();
        }
        if (email != null && !email.isBlank()) {
            return email.trim();
        }
        return name != null ? name.trim() : "";
    }
}
