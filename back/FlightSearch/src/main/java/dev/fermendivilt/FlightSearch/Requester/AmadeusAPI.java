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
import java.util.*;

public class AmadeusAPI {
    private final HttpClient client;
    private final String apiUrl;
    private final String key;
    private final String secret;
    private String tokenType;
    private String accessToken;
    private LocalDateTime expiration;

    private Map<String, String> airportNameFromCode = HashMap.newHashMap(64);

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

    public List<AirportSearchResponseDTO> getAirports(String keyword) throws IOException, InterruptedException {
        List<AirportSearchResponseDTO> result = new ArrayList<>();

        int elementLimit = 5;

        URI url = UriComponentsBuilder.fromHttpUrl(apiUrl + "v1/reference-data/locations")
            .queryParam("subType","AIRPORT")
            .queryParam("keyword", keyword)
            .queryParam("page[limit]", elementLimit)
            .queryParam("view", "LIGHT")
            .build().toUri();

        JsonObject response;
        try {
            response = makeRequest(url);
        } catch(SyncFailedException _) {
            response = makeRequest(URI.create("https://21cddc1f-4b79-4af6-b653-f13e26c28830.mock.pstmn.io"), true);
        }

        response.getAsJsonArray("data").forEach(jsonElement -> {
                JsonObject element = jsonElement.getAsJsonObject();
                result.add(
                    new AirportSearchResponseDTO(
                        element.get("name").getAsString(),
                        element.getAsJsonObject("address").get("countryName").getAsString(),
                        element.get("iataCode").getAsString()));
            });

        return result;
    }

    private String getAirportByCode(String code) throws IOException, InterruptedException {
        URI url = UriComponentsBuilder.fromHttpUrl(apiUrl + "v1/reference-data/locations")
            .queryParam("subType","AIRPORT")
            .queryParam("keyword", code)
            .queryParam("view", "LIGHT")
            .build().toUri();

        JsonObject response;
        try {
            response = makeRequest(url);
        } catch(SyncFailedException _) {
            response = makeRequest(URI.create("https://21cddc1f-4b79-4af6-b653-f13e26c28830.mock.pstmn.io"), true);
        }

        JsonObject element = response.getAsJsonArray("data").get(0).getAsJsonObject();

        String result = element.get("name").getAsString();

        airportNameFromCode.put(code, result);

        return result;
    }


    public FlightSearchResponseDTO getFlights(SearchDTO dto) throws IOException, InterruptedException, SyncFailedException {
        //int elementLimit = 10;
        boolean roundTrip = !dto.getDepartureDate().equals(dto.getReturnDate());

        UriComponentsBuilder url = UriComponentsBuilder.fromHttpUrl(apiUrl + "v2/shopping/flight-offers")
            .queryParam("originLocationCode", dto.getDepartureAirport())
            .queryParam("destinationLocationCode", dto.getArrivalAirport())
            .queryParam("departureDate", dto.getDepartureDate())
            .queryParam("adults", dto.getAdults())
            .queryParam("nonStop", dto.getNonStop())
            .queryParam("currencyCode", dto.getCurrency());
            //.queryParam("max", elementLimit);

        if(roundTrip) url.queryParam("returnDate", dto.getReturnDate());

        JsonObject responseBody;
        try {
            responseBody = makeRequest(url.build().toUri());
        } catch(SyncFailedException _) {

            responseBody = makeRequest(URI.create("https://47e25352-8d0c-49c9-9f0c-bbfe4414cf6f.mock.pstmn.io/flight-offers/roundTrip"), true);
        }

        Gson gson = new GsonBuilder().create();

        FlightSearchResponseDTO result = gson.fromJson(responseBody, FlightSearchResponseDTO.class);

        var resultLocationReference = result.getDictionaries().getLocations();

        for (Map.Entry<String, FlightSearchResponseDTO.Location> entry : resultLocationReference.entrySet()) {
            String key = entry.getKey();
            FlightSearchResponseDTO.Location value = entry.getValue();
            if (airportNameFromCode.containsKey(key))
                value.setCityCode(airportNameFromCode.get(key));
            else
                value.setCityCode(getAirportByCode(key));
        }

        return result;
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

        if(result.get("errors") != null)
            throw new SyncFailedException("Invalid external error, please contact administrator.");

        return result;
    }
    
    private JsonObject makeRequest(URI uri, boolean noAuth) throws IOException, InterruptedException, SyncFailedException {
        HttpRequest request = HttpRequest.newBuilder()
            .uri(uri)
            .header("Authorization", tokenType + " " + accessToken)
            .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        JsonObject result = JsonParser.parseString(response.body()).getAsJsonObject();

        if(result.get("errors") != null)
            throw new SyncFailedException("Invalid external error, please contact administrator.");

        return result;
    }
}