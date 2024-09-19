package dev.fermendivilt.FlightSearch.service;

import dev.fermendivilt.FlightSearch.Requester.AmadeusAPI;
import dev.fermendivilt.FlightSearch.configuration.AmadeusApiProperties;
import dev.fermendivilt.FlightSearch.dto.SearchResponseDTO;
import dev.fermendivilt.FlightSearch.dto.AirportSearchResponseDTO;
import dev.fermendivilt.FlightSearch.dto.SearchDTO;
import dev.fermendivilt.FlightSearch.dto.amadeus.FlightSearchResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.SyncFailedException;
import java.util.ArrayList;
import java.util.List;

@Service
public class FlightService {
    AmadeusApiProperties apiProperties;
    AmadeusAPI amadeusAPI;

    @Autowired
    FlightService(AmadeusApiProperties apiProperties) {

        this.apiProperties = apiProperties;
        amadeusAPI = new AmadeusAPI(apiProperties.getKey(), apiProperties.getSecret());
    }

    public List<AirportSearchResponseDTO> getAirports(String keyword) throws IOException, InterruptedException, SyncFailedException {
        return amadeusAPI.getAirports(keyword);
    }

    public FlightSearchResponseDTO searchFlights(SearchDTO dto) throws IOException, InterruptedException, SyncFailedException {
         FlightSearchResponseDTO apiResult = amadeusAPI.getFlights(dto);

        return apiResult;
    }
}
