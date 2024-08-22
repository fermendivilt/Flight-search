package dev.fermendivilt.FlightSearch.service;

import dev.fermendivilt.FlightSearch.dto.AmadeusFlightSearchResponseDTO;
import dev.fermendivilt.FlightSearch.dto.SearchDTO;
import org.springframework.stereotype.Service;

@Service
public class FlightService {

    public AmadeusFlightSearchResponseDTO searchFlights(SearchDTO dto) {
        return new AmadeusFlightSearchResponseDTO();
    }
}
