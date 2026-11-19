package com.leagueline.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.leagueline.model.League;
import com.leagueline.model.LeagueStatus;

public interface LeagueRepository extends JpaRepository<League, Long> {
    List<League> findByGameIgnoreCase(String game);
    List<League> findByStatus(LeagueStatus status);
    long countByStatus(LeagueStatus status);
}