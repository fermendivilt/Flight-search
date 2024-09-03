package dev.fermendivilt.FlightSearch.controller;

import dev.fermendivilt.FlightSearch.dto.SearchDTO;
import dev.fermendivilt.FlightSearch.dto.SearchResponseDTO;
import dev.fermendivilt.FlightSearch.dto.AirportSearchResponseDTO;
import dev.fermendivilt.FlightSearch.dto.amadeus.FlightSearchResponseDTO;
import dev.fermendivilt.FlightSearch.enums.Currency;
import dev.fermendivilt.FlightSearch.service.FlightService;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.SyncFailedException;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

@RestController
@RequestMapping("api/flight")
public class FlightController {
    @Autowired
    FlightService flightService;

    @GetMapping("/airports")
    public ResponseEntity<List<AirportSearchResponseDTO>> searchAirports(@RequestParam @NotBlank String keyword) {
        try {
            return ResponseEntity.ok(flightService.getAirports(keyword));

        } catch (SyncFailedException e) {
            return ResponseEntity.status(502).build();

        } catch (IOException e) {
            throw new RuntimeException(e);

        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/search")
    //List<SearchResponseDTO>
    public ResponseEntity<FlightSearchResponseDTO> searchFlights(@RequestParam @NotBlank String departureAirport,
                                                                 @RequestParam @NotBlank String arrivalAirport,
                                                                 @RequestParam @NotBlank String departureDate,
                                                                 @RequestParam @NotBlank String arrivalDate,
                                                                 @RequestParam @Min(1) Integer adults,
                                                                 @RequestParam @NotNull Currency currency,
                                                                 @RequestParam @NotNull Boolean nonStop) {
        try {
            LocalDate departure = LocalDate.parse(departureDate);
            LocalDate arrival = LocalDate.parse(arrivalDate);
            SearchDTO dto = new SearchDTO(departureAirport, arrivalAirport,
                departure, arrival, adults, currency, nonStop);

            return ResponseEntity.ok(flightService.searchFlights(dto));

        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().build();

        } catch (SyncFailedException e) {
            return ResponseEntity.status(502).build();

        } catch (IOException e) {
            throw new RuntimeException(e);

        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
