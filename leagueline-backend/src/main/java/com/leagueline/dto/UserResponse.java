package com.leagueline.dto;

import java.time.Instant;

import com.leagueline.model.Role;
import com.leagueline.model.User;

public class UserResponse {
    private Long id;
    private String fullName;
    private String name;
    private String email;
    private Role role;
    private String avatarUrl;
    private Instant createdAt;

    public static UserResponse from(User user) {
        UserResponse dto = new UserResponse();
        dto.id = user.getUserId();
        dto.fullName = user.getFullName();
        dto.name = user.getFullName();
        dto.email = user.getEmail();
        dto.role = user.getRole();
        dto.avatarUrl = user.getAvatarUrl();
        dto.createdAt = user.getCreatedAt();
        return dto;
    }

    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public Role getRole() { return role; }
    public String getAvatarUrl() { return avatarUrl; }
    public Instant getCreatedAt() { return createdAt; }
}