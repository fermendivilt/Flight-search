import { FlightOffer, Dictionaries, Itinerary } from "../dto/SearchResponseDTO";
import { DurationTo12H } from "../utils/TimeUtils";

interface RoundFlightSummary extends OneWayFlightSummary {
  returnFlight: FlightSummary;
}

interface OneWayFlightSummary {
  id: number;
  forwardFlight: FlightSummary;
}

interface FlightSummary {
  initialDeparture: string;
  finalArrival: string;
  departureAirport: Airport;
  arrivalAirport: Airport;
  airline: Airline;
  operatingAirline?: Airline;
  totalMinutes: number;
  totalTime: string;
  stops: Stop[];
  totalPrice: string;
  pricePerTraveler: string;
}

interface Airport extends NameCode {}

interface Airline extends NameCode {}

interface NameCode {
  name: string;
  code: string;
}

interface Stop {
  airport: Airport;
  duration: string;
}

function createRoundFlightSummary(
  id: number,
  flightOffer: FlightOffer,
  dictionaries: Dictionaries
): RoundFlightSummary {
  return {
    id: id,
    forwardFlight: createFlightSummary(
      flightOffer,
      dictionaries,
      flightOffer.itineraries[0]
    ),
    returnFlight: createFlightSummary(
      flightOffer,
      dictionaries,
      flightOffer.itineraries[1]
    ),
  };
}

function createOneWayFlightSummary(
  id: number,
  flightOffer: FlightOffer,
  dictionaries: Dictionaries
): OneWayFlightSummary {
  return {
    id: id,
    forwardFlight: createFlightSummary(flightOffer, dictionaries),
  };
}

function createFlightSummary(
  flightOffer: FlightOffer,
  dictionaries: Dictionaries,
  itinerary?: Itinerary
): FlightSummary {
  const baseItinerary = itinerary ?? flightOffer.itineraries[0];

  const initialSegment = baseItinerary.segments[0];
  const finalSegment = baseItinerary.segments.slice(-1)[0];

  const initialDeparture = initialSegment.departure.at;
  const finalArrival = finalSegment.arrival.at;

  const departureAirport: Airport = {
    name: dictionaries.locations[initialSegment.departure.iataCode].cityCode,
    code: initialSegment.departure.iataCode,
  };

  const arrivalAirport: Airport = {
    name: dictionaries.locations[finalSegment.arrival.iataCode].cityCode,
    code: finalSegment.arrival.iataCode,
  };

  const airline: Airline = {
    name: dictionaries.carriers[initialSegment.carrierCode],
    code: initialSegment.carrierCode,
  };

  const operatingAirlineSegment =
    initialSegment.operating ??
    finalSegment.operating ??
    initialSegment.carrierCode;

  const operatingAirline: Airline | undefined =
    operatingAirlineSegment.carrierCode !== initialSegment.carrierCode
      ? {
          name: dictionaries.carriers[operatingAirlineSegment.carrierCode],
          code: operatingAirlineSegment.carrierCode,
        }
      : undefined;

  const stops: Stop[] = baseItinerary.segments.slice(1).map((segment) => ({
    airport: {
      name: dictionaries.locations[segment.departure.iataCode].cityCode,
      code: segment.departure.iataCode,
    },
    duration: DurationTo12H(segment.duration)[1],
  }));

  const totalPrice = flightOffer.price.grandTotal;
  const pricePerTraveler = (
    parseFloat(totalPrice) / flightOffer.travelerPricings.length
  ).toFixed(2);

  const duration = DurationTo12H(baseItinerary.duration);

  return {
    initialDeparture,
    finalArrival,
    departureAirport,
    arrivalAirport,
    airline,
    operatingAirline,
    totalMinutes: duration[0],
    totalTime: duration[1],
    stops,
    totalPrice,
    pricePerTraveler,
  };
}

export type {
  FlightSummary,
  OneWayFlightSummary,
  RoundFlightSummary,
  Airline,
  Airport,
  Stop,
};
export { createFlightSummary, createOneWayFlightSummary, createRoundFlightSummary };
