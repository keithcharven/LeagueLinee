package com.leagueline.service;

import java.time.Instant;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import com.leagueline.dto.AuthResponse;
import com.leagueline.dto.GoogleAuthRequest;
import com.leagueline.dto.LoginRequest;
import com.leagueline.dto.RegisterRequest;
import com.leagueline.dto.UserResponse;
import com.leagueline.exception.ApiException;
import com.leagueline.model.RevokedToken;
import com.leagueline.model.Role;
import com.leagueline.model.User;
import com.leagueline.repository.RevokedTokenRepository;
import com.leagueline.repository.UserRepository;
import com.leagueline.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RevokedTokenRepository revokedTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final String googleClientId;
    private final RestClient restClient;

    public AuthService(
            UserRepository userRepository,
            RevokedTokenRepository revokedTokenRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            @Value("${app.google.client-id:}") String googleClientId) {
        this.userRepository = userRepository;
        this.revokedTokenRepository = revokedTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.googleClientId = googleClientId;
        this.restClient = RestClient.create();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new ApiException(HttpStatus.CONFLICT, "An account with this email already exists.");
        }

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved);
        return new AuthResponse(token, UserResponse.from(saved));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password."));

        if (user.getPasswordHash() == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, UserResponse.from(user));
    }

    @Transactional
    public AuthResponse loginWithGoogle(GoogleAuthRequest request) {
        Map<String, Object> tokenInfo;
        try {
            tokenInfo = restClient.get()
                    .uri("https://oauth2.googleapis.com/tokeninfo?id_token={token}", request.getIdToken())
                    .retrieve()
                    .body(new ParameterizedTypeReference<>() {});
        } catch (Exception e) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid or expired Google ID token.");
        }

        if (tokenInfo == null || tokenInfo.get("email") == null || tokenInfo.get("sub") == null) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Unable to verify Google account.");
        }

        if (googleClientId != null && !googleClientId.isBlank()) {
            String audience = String.valueOf(tokenInfo.get("aud"));
            if (!googleClientId.equals(audience)) {
                throw new ApiException(HttpStatus.UNAUTHORIZED, "Google token audience mismatch.");
            }
        }

        String googleId = String.valueOf(tokenInfo.get("sub"));
        String email = String.valueOf(tokenInfo.get("email")).trim().toLowerCase();
        String fullName = tokenInfo.get("name") != null ? String.valueOf(tokenInfo.get("name")) : email.split("@")[0];
        String avatarUrl = tokenInfo.get("picture") != null ? String.valueOf(tokenInfo.get("picture")) : null;

        User user = userRepository.findByGoogleId(googleId)
                .or(() -> userRepository.findByEmailIgnoreCase(email))
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setGoogleId(googleId);
                    newUser.setEmail(email);
                    newUser.setFullName(fullName);
                    newUser.setAvatarUrl(avatarUrl);
                    newUser.setRole(request.getRole() != null ? request.getRole() : Role.TEAM_MANAGER);
                    return userRepository.save(newUser);
                });

        if (user.getGoogleId() == null) {
            user.setGoogleId(googleId);
            if (user.getAvatarUrl() == null) {
                user.setAvatarUrl(avatarUrl);
            }
            user = userRepository.save(user);
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, UserResponse.from(user));
    }

    @Transactional
    public void logout(String bearerHeader) {
        if (bearerHeader == null || !bearerHeader.startsWith("Bearer ")) {
            return;
        }
        String token = bearerHeader.substring(7).trim();
        if (!token.isEmpty() && jwtService.isValid(token)) {
            String hash = jwtService.hashToken(token);
            if (!revokedTokenRepository.existsByTokenHash(hash)) {
                Instant expiry = jwtService.extractExpiration(token);
                revokedTokenRepository.save(new RevokedToken(hash, expiry));
            }
            revokedTokenRepository.deleteByExpiresAtBefore(Instant.now());
        }
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User session is no longer valid."));
        return UserResponse.from(user);
    }
}