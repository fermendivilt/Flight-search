package dev.fermendivilt.FlightSearch.service;

import dev.fermendivilt.FlightSearch.dto.AmadeusFlightSearchResponseDTO;
import dev.fermendivilt.FlightSearch.Requester.AmadeusAPI;
import dev.fermendivilt.FlightSearch.configuration.AmadeusApiProperties;
import dev.fermendivilt.FlightSearch.dto.SearchDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FlightService {
    AmadeusApiProperties apiProperties;
    AmadeusAPI amadeusAPI;

    @Autowired
    FlightService(AmadeusApiProperties apiProperties) {

        this.apiProperties = apiProperties;
        amadeusAPI = new AmadeusAPI(apiProperties.getKey(), apiProperties.getSecret());
    }

    public AmadeusFlightSearchResponseDTO searchFlights(SearchDTO dto) {
        return new AmadeusFlightSearchResponseDTO();
    }
}
