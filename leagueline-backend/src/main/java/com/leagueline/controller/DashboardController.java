package com.leagueline.controller;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.leagueline.dto.UserResponse;
import com.leagueline.model.LeagueStatus;
import com.leagueline.model.Role;
import com.leagueline.repository.LeagueRepository;
import com.leagueline.repository.UserRepository;
import com.leagueline.service.AuthService;

@RestController
@RequestMapping("/api")
public class DashboardController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final LeagueRepository leagueRepository;

    public DashboardController(
            AuthService authService,
            UserRepository userRepository,
            LeagueRepository leagueRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.leagueRepository = leagueRepository;
    }

    @GetMapping("/organizer/dashboard")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<?> organizerDashboard(Authentication authentication) {
        UserResponse currentUser = authService.getCurrentUser(authentication.getName());
        List<UserResponse> recentUsers = userRepository.findTop10ByOrderByCreatedAtDesc()
                .stream()
                .map(UserResponse::from)
                .toList();

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("user", currentUser);
        payload.put("roleSummary", "League Organizer Control Center");
        payload.put("stats", Map.of(
                "totalUsers", userRepository.count(),
                "organizers", userRepository.countByRole(Role.ORGANIZER),
                "teamManagers", userRepository.countByRole(Role.TEAM_MANAGER),
                "fans", userRepository.countByRole(Role.FAN),
                "totalLeagues", leagueRepository.count(),
                "openRegistrationLeagues", leagueRepository.countByStatus(LeagueStatus.REGISTRATION_OPEN)
        ));
        payload.put("recentUsers", recentUsers);
        return ResponseEntity.ok(payload);
    }

    @GetMapping("/manager/dashboard")
    @PreAuthorize("hasRole('TEAM_MANAGER')")
    public ResponseEntity<?> managerDashboard(Authentication authentication) {
        UserResponse currentUser = authService.getCurrentUser(authentication.getName());

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("user", currentUser);
        payload.put("roleSummary", "Team Manager Operations Portal");
        payload.put("stats", Map.of(
                "openLeagues", leagueRepository.countByStatus(LeagueStatus.REGISTRATION_OPEN),
                "ongoingLeagues", leagueRepository.countByStatus(LeagueStatus.ONGOING),
                "totalLeagues", leagueRepository.count()
        ));
        payload.put("openLeaguesList", leagueRepository.findByStatus(LeagueStatus.REGISTRATION_OPEN));
        return ResponseEntity.ok(payload);
    }

    @GetMapping("/fan/dashboard")
    @PreAuthorize("hasRole('FAN')")
    public ResponseEntity<?> fanDashboard(Authentication authentication) {
        UserResponse currentUser = authService.getCurrentUser(authentication.getName());

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("user", currentUser);
        payload.put("roleSummary", "Player & Fan Esports Hub");
        payload.put("stats", Map.of(
                "ongoingLeagues", leagueRepository.countByStatus(LeagueStatus.ONGOING),
                "openLeagues", leagueRepository.countByStatus(LeagueStatus.REGISTRATION_OPEN),
                "totalLeagues", leagueRepository.count()
        ));
        payload.put("leagues", leagueRepository.findAll());
        return ResponseEntity.ok(payload);
    }
}