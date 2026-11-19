package com.leagueline.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.leagueline.model.League;
import com.leagueline.model.LeagueStatus;
import com.leagueline.repository.LeagueRepository;

@Configuration
public class LeagueSeedConfig {

    @Bean
    CommandLineRunner seedDefaultLeagues(LeagueRepository leagueRepository) {
        return args -> {
            if (leagueRepository.count() == 0) {
                leagueRepository.saveAll(List.of(
                        new League("Cebu Inter-School Cup S3", "Mobile Legends", "Season 3", LeagueStatus.ONGOING, 0),
                        new League("Visayas Valorant Open", "Valorant", "2026 Open", LeagueStatus.REGISTRATION_OPEN, 0),
                        new League("Campus Dota Clash", "Dota 2", "Season 1", LeagueStatus.REGISTRATION_OPEN, 0)
                ));
            }
        };
    }
}