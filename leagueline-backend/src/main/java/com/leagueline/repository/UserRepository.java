package com.leagueline.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.leagueline.model.Role;
import com.leagueline.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailIgnoreCase(String email);
    Optional<User> findByGoogleId(String googleId);
    boolean existsByEmailIgnoreCase(String email);
    long countByRole(Role role);
    List<User> findTop10ByOrderByCreatedAtDesc();
}