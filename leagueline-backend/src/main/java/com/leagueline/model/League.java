package com.leagueline.model;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "leagues")
public class League {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "league_id")
    private Long id;

    @Column(name = "organizer_id")
    private Long organizerId;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(name = "game_title", nullable = false, length = 100)
    private String game;

    @Column(nullable = false, length = 100)
    private String season;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private LeagueStatus status = LeagueStatus.REGISTRATION_OPEN;

    @Column(name = "team_count", nullable = false)
    private int teams = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = Instant.now();
        }
    }

    public League() {}

    public League(String name, String game, String season, LeagueStatus status, int teams) {
        this.name = name;
        this.game = game;
        this.season = season;
        this.status = status;
        this.teams = teams;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrganizerId() { return organizerId; }
    public void setOrganizerId(Long organizerId) { this.organizerId = organizerId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getGame() { return game; }
    public void setGame(String game) { this.game = game; }

    public String getSeason() { return season; }
    public void setSeason(String season) { this.season = season; }

    public LeagueStatus getStatus() { return status; }
    public void setStatus(LeagueStatus status) { this.status = status; }

    public int getTeams() { return teams; }
    public void setTeams(int teams) { this.teams = teams; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}