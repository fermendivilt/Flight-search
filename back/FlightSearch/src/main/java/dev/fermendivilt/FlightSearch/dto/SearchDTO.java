package dev.fermendivilt.FlightSearch.dto;

import dev.fermendivilt.FlightSearch.enums.Currency;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class SearchDTO {
    private String departureAirport;
    private String arrivalAirport;
    private LocalDate departureDate;
    private LocalDate arrivalDate;
    private Currency currency;
    private Boolean nonStop;
}
