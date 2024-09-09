import { FlightOffer, Dictionaries } from "../dto/SearchResponseDTO";
import { FlightSummary, Airline } from "./Flights";

interface FlightDetail extends FlightSummary {
  segments: SegmentDetail[];
  priceBreakdown: PriceBreakdown;
}

interface SegmentDetail {
  departureTime: string;
  arrivalTime: string;
  airline: Airline;
  flightNumber: string;
  operatingAirline?: Airline;
  aircraftType: string;
  travelerFareDetails: TravelerFareDetail[];
  layoverTime?: string;
}

interface TravelerFareDetail {
  cabin: string;
  class: string;
  amenities: Amenity[];
}

interface Amenity {
  name: string;
  isChargeable: boolean;
}

interface PriceBreakdown {
  basePrice: string;
  totalPrice: string;
  fees: Fee[];
  pricePerTraveler: string;
}

interface Fee {
  amount: string;
  type: string;
}

function createFlightDetail(
  flightOffer: FlightOffer,
  dictionaries: Dictionaries,
  flightSummary: FlightSummary
): FlightDetail {
  const summary = flightSummary;

  const segments: SegmentDetail[] = flightOffer.itineraries.flatMap(
    (itinerary) =>
      itinerary.segments.map((segment, index, segments) => {
        const layoverTime =
          index > 0
            ? calculateLayoverTime(
                segments[index - 1].arrival.at,
                segment.departure.at
              )
            : undefined;
        return {
          departureTime: segment.departure.at,
          arrivalTime: segment.arrival.at,
          airline: {
            name: dictionaries.carriers[segment.carrierCode],
            code: segment.carrierCode,
          },
          flightNumber: segment.number,
          operatingAirline:
            segment.operating.carrierCode !== segment.carrierCode
              ? {
                  name: dictionaries.carriers[segment.operating.carrierCode],
                  code: segment.operating.carrierCode,
                }
              : undefined,
          aircraftType: dictionaries.aircraft[segment.aircraft.code],
          travelerFareDetails: flightOffer.travelerPricings.flatMap(
            (traveler) =>
              traveler.fareDetailsBySegment
                .filter((fareDetail) => fareDetail.segmentId === segment.id)
                .map((fareDetail) => ({
                  cabin: fareDetail.cabin,
                  class: fareDetail.class,
                  amenities: fareDetail.amenities.map((amenity) => ({
                    name: amenity.description,
                    isChargeable: amenity.isChargeable,
                  })),
                }))
          ),
          layoverTime,
        };
      })
  );

  const priceBreakdown: PriceBreakdown = {
    basePrice: flightOffer.price.base,
    totalPrice: flightOffer.price.grandTotal,
    fees: flightOffer.price.fees,
    pricePerTraveler: summary.pricePerTraveler,
  };

  return {
    ...summary,
    segments,
    priceBreakdown,
  };
}

function calculateLayoverTime(arrival: string, departure: string): string {
  const arrivalDate = new Date(arrival);
  const departureDate = new Date(departure);
  const diffMs = departureDate.getTime() - arrivalDate.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${diffHours}H${diffMinutes}M`;
}
