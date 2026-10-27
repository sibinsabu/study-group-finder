package com.app.studygroup.dto;

import com.app.studygroup.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto implements Serializable {

    private static final long serialVersionUID = 1L;

    private String id;
    private String name;
    private String username;
    private String email;
    private String university;
    private String avatar;
    private String role;
    private String expertise;
    private String title;
    private String bio;
    private Integer experienceYears;
    private String linkedInOrWebsite;
    private Double rating;
    private List<String> joinedGroups;
    @Builder.Default
    private List<String> privileges = new java.util.ArrayList<>();
    private LocalDateTime createdAt;

    public boolean isAdmin() {
        return "admin".equalsIgnoreCase(this.role);
    }

    public static UserDto fromEntity(User user) {
        if (user == null) return null;
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .username(user.getUsername() != null ? user.getUsername() : user.getEmail())
                .email(user.getEmail())
                .university(user.getUniversity())
                .avatar(user.getAvatar())
                .role(user.getRole() != null ? user.getRole() : "student")
                .privileges(user.getPrivileges() != null ? user.getPrivileges() : new java.util.ArrayList<>())
                .expertise(user.getExpertise())
                .title(user.getTitle())
                .bio(user.getBio())
                .experienceYears(user.getExperienceYears())
                .linkedInOrWebsite(user.getLinkedInOrWebsite())
                .rating(user.getRating() != null ? user.getRating() : 5.0)
                .joinedGroups(user.getJoinedGroups())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
