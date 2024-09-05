package dev.fermendivilt.FlightSearch.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AirportSearchResponseDTO {
    private String name;
    private String country;
    private String iataCode;
}
