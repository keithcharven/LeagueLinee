package com.leagueline.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.leagueline.repository.LeagueRepository;

@RestController
@RequestMapping("/api")
public class PublicLeagueController {

    private final LeagueRepository leagueRepository;

    public PublicLeagueController(LeagueRepository leagueRepository) {
        this.leagueRepository = leagueRepository;
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "LeagueLine API"));
    }

    @GetMapping("/leagues")
    public ResponseEntity<?> getLeagues(@RequestParam(required = false) String game) {
        if (game != null && !game.isBlank() && !game.equalsIgnoreCase("All")) {
            return ResponseEntity.ok(leagueRepository.findByGameIgnoreCase(game));
        }
        return ResponseEntity.ok(leagueRepository.findAll());
    }

    @GetMapping("/leagues/{id}/standings")
    public ResponseEntity<?> getStandings(@PathVariable Long id) {
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/leagues/{id}/matches")
    public ResponseEntity<?> getMatches(@PathVariable Long id) {
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/leagues/{id}/leaderboard")
    public ResponseEntity<?> getLeaderboard(@PathVariable Long id) {
        return ResponseEntity.ok(List.of());
    }
}