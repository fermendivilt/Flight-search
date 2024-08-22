package dev.fermendivilt.FlightSearch.controller;

import dev.fermendivilt.FlightSearch.dto.SearchDTO;
import dev.fermendivilt.FlightSearch.dto.SearchResponseDTO;
import dev.fermendivilt.FlightSearch.enums.Currency;
import dev.fermendivilt.FlightSearch.service.FlightService;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;

@RestController
@RequestMapping("api/Flight")
public class FlightController {
    @Autowired
    FlightService flightService;

    @GetMapping("/search")
    public ResponseEntity<SearchResponseDTO> searchFlights(@RequestParam @NotBlank String departureAirport,
                                                           @RequestParam @NotBlank String arrivalAirport,
                                                           @RequestParam @NotBlank String departureDate,
                                                           @RequestParam @NotBlank String arrivalDate,
                                                           @RequestParam @NotNull Currency currency,
                                                           @RequestParam @NotNull Boolean nonStop) {
        try {
            LocalDate departure = LocalDate.parse(departureDate);
            LocalDate arrival = LocalDate.parse(arrivalDate);
            SearchDTO dto = new SearchDTO(departureAirport, arrivalAirport, departure, arrival, currency, nonStop);

            return ResponseEntity.ok(new SearchResponseDTO(flightService.searchFlights(dto)));

        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
