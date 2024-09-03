package dev.fermendivilt.FlightSearch.configuration;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Setter
@Getter
@Configuration
@ConfigurationProperties("spring.datasource.amadeus")
public class AmadeusApiProperties {
    private String key;
    private String secret;
}

