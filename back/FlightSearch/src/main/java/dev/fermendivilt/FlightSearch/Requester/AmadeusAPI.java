package dev.fermendivilt.FlightSearch.Requester;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import dev.fermendivilt.FlightSearch.dto.SearchDTO;
import dev.fermendivilt.FlightSearch.dto.AirportSearchResponseDTO;
import dev.fermendivilt.FlightSearch.dto.amadeus.FlightSearchResponseDTO;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.io.SyncFailedException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class AmadeusAPI {
    private final HttpClient client;
    private final String apiUrl;
    private final String key;
    private final String secret;
    private String tokenType;
    private String accessToken;
    private LocalDateTime expiration;

    public AmadeusAPI(String key, String secret) {
        client = HttpClient.newBuilder().build();
        apiUrl = "https://test.api.amadeus.com/";
        this.key = key;
        this.secret = secret;
    }

    public void getToken() throws IOException, InterruptedException, SyncFailedException {
        URI url = URI.create(apiUrl + "v1/security/oauth2/token");
        String body = "grant_type=client_credentials&client_id=" + key + "&client_secret=" + secret;

        HttpRequest request = HttpRequest.newBuilder().uri(url)
            .header("Content-Type", "application/x-www-form-urlencoded")
            .POST(HttpRequest.BodyPublishers.ofString(body))
            .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        JsonObject result = JsonParser.parseString(response.body()).getAsJsonObject();

        if(result.get("error") != null ||
            !result.get("state").getAsString().equals("approved"))
            throw new SyncFailedException("Rejected key, please contact administrator.");

        tokenType = result.get("token_type").getAsString();
        accessToken = result.get("access_token").getAsString();
        expiration = LocalDateTime.now().plusSeconds(result.get("expires_in").getAsLong());
    }

    public List<AirportSearchResponseDTO> getAirports(String keyword) throws IOException, InterruptedException, SyncFailedException {
        List<AirportSearchResponseDTO> result = new ArrayList<>();

        int elementLimit = 5;

        URI url = UriComponentsBuilder.fromHttpUrl(apiUrl + "v1/reference-data/locations")
            .queryParam("subType","AIRPORT")
            .queryParam("keyword", keyword)
            .queryParam("page[limit]", elementLimit) // %5Blimit%5D
            .queryParam("view", "LIGHT")
            .build().toUri();

        JsonObject response = makeRequest(url);

        response.getAsJsonArray("data").forEach(jsonElement -> {
                JsonObject element = jsonElement.getAsJsonObject();
                result.add(
                    new AirportSearchResponseDTO(
                        element.get("name").getAsString(),
                        element.get("iataCode").getAsString()));
            });

        return result;
    }

    public FlightSearchResponseDTO getFlights(SearchDTO dto) throws IOException, InterruptedException, SyncFailedException {
        int elementLimit = 10;
        boolean roundTrip = !dto.getDepartureDate().equals(dto.getArrivalDate());

        URI url = UriComponentsBuilder.fromHttpUrl(apiUrl + "v2/shopping/flight-offers")
            .queryParam("originLocationCode", dto.getDepartureAirport())
            .queryParam("destinationLocationCode", dto.getArrivalAirport())
            .queryParam("departureDate", dto.getDepartureDate())
            .queryParam(roundTrip ? "returnDate" : "", dto.getArrivalDate())
            .queryParam("adults", dto.getAdults())
            .queryParam("nonStop", dto.getNonStop())
            .queryParam("currencyCode", dto.getCurrency())
            .queryParam("max", elementLimit)
            .build().toUri();

        JsonObject responseBody = makeRequest(url);

        Gson gson = new GsonBuilder().create();

        return gson.fromJson(responseBody.getAsJsonArray("data"), FlightSearchResponseDTO.class);
    }

    private JsonObject makeRequest(URI uri) throws IOException, InterruptedException, SyncFailedException {
        if(expiration == null || expiration.isBefore(LocalDateTime.now()))
            getToken();

        HttpRequest request = HttpRequest.newBuilder()
            .uri(uri)
            .header("Authorization", tokenType + " " + accessToken)
            .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        JsonObject result = JsonParser.parseString(response.body()).getAsJsonObject();

        if(result.get("error") != null)
            throw new SyncFailedException("Invalid external error, please contact administrator.");

        return result;
    }
}