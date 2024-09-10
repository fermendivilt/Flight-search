package dev.fermendivilt.FlightSearch.dto;

import dev.fermendivilt.FlightSearch.dto.amadeus.FlightSearchResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class SearchResponseDTO {
    private List<Trip> data;

    public SearchResponseDTO(FlightSearchResponseDTO dto) {
        var dictionaries = dto.getDictionaries();

        for (var flight : dto.getData()) {
            for (var itinerary : flight.getItineraries()) {
                Trip trip = new Trip();

                var start = itinerary.getSegments().getFirst();
                var departure = start.getDeparture();
                trip.setDeparture(new Flight(
                    departure.getAt(),
                    new Airport(
                        dictionaries.getLocations().get(departure.getIataCode()).getCityCode(),
                        departure.getIataCode()
                    )
                ));

                trip.setAirline(new Airline(
                    dictionaries.getCarriers().get(departure.getIataCode()),
                    departure.getIataCode()
                ));

                if (!departure.getIataCode().equals(start.getOperating().getCarrierCode()))
                    trip.setOperatingAirline(new Airline(
                        dictionaries.getCarriers().get(start.getOperating().getCarrierCode()),
                        start.getOperating().getCarrierCode()
                    ));

                trip.setTotalDuration(itinerary.getDuration());

                var destination = itinerary.getSegments().getLast().getArrival();
                trip.setArrival(new Flight(
                    destination.getAt(),
                    new Airport(
                        dictionaries.getLocations().get(destination.getIataCode()).getCityCode(),
                        destination.getIataCode()
                    )
                ));

                ArrayList<Stop> stops = new ArrayList<>();
                for (FlightSearchResponseDTO.Segment segment : itinerary.getSegments()) {
                    stops.add(new Stop(
                        segment.getDuration(),
                        new Airport(
                            dictionaries.getLocations().get(segment.getDeparture().getIataCode()).getCityCode(),
                            segment.getDeparture().getIataCode()
                        )
                    ));
                }
                trip.setStops(stops);

                trip.setCosts(new Costs(
                    flight.getPrice().getCurrency(),
                    flight.getPrice().getGrandTotal(),
                    flight.getTravelerPricings().getFirst().getPrice().getTotal()
                ));

                data.add(trip);
            }
        }
    }
}

@Data
class Trip {
    private Flight departure;
    private Flight arrival;
    private String totalDuration;
    private Airline airline;
    private Airline operatingAirline;
    private List<Stop> stops;
    private Costs costs;
}

@Getter
@Setter
@AllArgsConstructor
class Flight {
    private LocalDateTime date;
    private Airport airport;

    public Flight(String date, Airport airport) {
        this.date = LocalDateTime.parse(date);
        this.airport = airport;
    }
}

@Getter
@Setter
@AllArgsConstructor
class Costs {
    private String currency;
    private String grandTotal;
    private String perTraveler;
}

@Getter
@Setter
@AllArgsConstructor
class Stop {
    private String duration;
    private Airport airport;
}

class Airline extends NameCode {
    public Airline(String name, String code){
        super(name, code);
    }
}
class Airport extends NameCode {
    public Airport(String name, String code){
        super(name, code);
    }
}

@Getter
@Setter
@AllArgsConstructor
abstract class NameCode {
    private String name;
    private String code;
}