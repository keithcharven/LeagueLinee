package com.leagueline.dto;

import com.leagueline.model.Role;

import jakarta.validation.constraints.NotBlank;

public class GoogleAuthRequest {

    @NotBlank(message = "Google ID token is required.")
    private String idToken;

    private Role role;

    public String getIdToken() { return idToken; }
    public void setIdToken(String idToken) { this.idToken = idToken; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}