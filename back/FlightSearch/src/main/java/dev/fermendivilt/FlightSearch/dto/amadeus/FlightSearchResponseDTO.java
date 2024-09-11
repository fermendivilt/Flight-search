package dev.fermendivilt.FlightSearch.dto.amadeus;

import com.google.gson.annotations.SerializedName;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Data
public class FlightSearchResponseDTO {
    private Meta meta;
    private List<Data> data;
    private Dictionaries dictionaries;

    @Getter
    @Setter
    public static class Meta {
        private int count;
        private Links links;
    }

    @Getter
    @Setter
    public static class Links {
        private String self;
    }

    @Getter
    @Setter
    public static class Data {
        private String type;
        private String id;
        private String source;
        private boolean instantTicketingRequired;
        private boolean nonHomogeneous;
        private boolean oneWay;
        private String lastTicketingDate;
        private int numberOfBookableSeats;
        private List<Itinerary> itineraries;
        private Price price;
        private PricingOptions pricingOptions;
        private List<String> validatingAirlineCodes;
        private List<TravelerPricing> travelerPricings;
    }

    @Getter
    @Setter
    public static class Itinerary {
        private String duration;
        private List<Segment> segments;
    }

    @Getter
    @Setter
    public static class Segment {
        private Departure departure;
        private Arrival arrival;
        private String carrierCode;
        private String number;
        private Aircraft aircraft;
        private Operating operating;
        private String duration;
        private String id;
        private int numberOfStops;
        private boolean blacklistedInEU;
    }

    @Getter
    @Setter
    public static class Departure {
        private String iataCode;
        private String terminal;
        private String at;
    }

    @Getter
    @Setter
    public static class Arrival {
        private String iataCode;
        private String terminal;
        private String at;
    }

    @Getter
    @Setter
    public static class Aircraft {
        private String code;
    }

    @Getter
    @Setter
    public static class Operating {
        private String carrierCode;
    }

    @Getter
    @Setter
    public static class Price {
        private String currency;
        private String total;
        private String base;
        private List<Fee> fees;
        private String grandTotal;
    }

    @Getter
    @Setter
    public static class Fee {
        private String amount;
        private String type;
    }

    @Getter
    @Setter
    public static class PricingOptions {
        private List<String> fareType;
        private boolean includedCheckedBagsOnly;
    }

    @Getter
    @Setter
    public static class TravelerPricing {
        private String travelerId;
        private String fareOption;
        private String travelerType;
        private Price price;
        private List<FareDetailsBySegment> fareDetailsBySegment;
    }

    @Getter
    @Setter
    public static class FareDetailsBySegment {
        private String segmentId;
        private String cabin;
        private String fareBasis;
        @SerializedName("class")
        private String clazz;
        private IncludedCheckedBags includedCheckedBags;
    }

    @Getter
    @Setter
    public static class IncludedCheckedBags {
        private int weight;
        private String weightUnit;
    }

    @Getter
    @Setter
    public static class Dictionaries {
        private Map<String, Location> locations;
        private Map<String, String> aircraft;
        private Map<String, String> currencies;
        private Map<String, String> carriers;
    }

    @Getter
    @Setter
    public static class Location {
        private String cityCode;
        private String countryCode;
    }
}
