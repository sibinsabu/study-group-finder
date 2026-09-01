package com.app.studygroup.dto;

import com.app.studygroup.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private String id;
    private String name;
    private String email;
    private String university;
    private String avatar;
    private List<String> joinedGroups;
    private LocalDateTime createdAt;

    public static UserDto fromEntity(User user) {
        if (user == null) return null;
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .university(user.getUniversity())
                .avatar(user.getAvatar())
                .joinedGroups(user.getJoinedGroups())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
