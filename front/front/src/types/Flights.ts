import { FlightOffer, Dictionaries } from "../dto/SearchResponseDTO";

interface FlightSummary {
  initialDeparture: string;
  finalArrival: string;
  departureAirport: Airport;
  arrivalAirport: Airport;
  airline: Airline;
  operatingAirline?: Airline;
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

function createFlightSummary(flightOffer: FlightOffer, dictionaries: Dictionaries): FlightSummary {
    const initialSegment = flightOffer.itineraries[0].segments[0];
    const finalSegment = flightOffer.itineraries[flightOffer.itineraries.length - 1].segments.slice(-1)[0];
  
    const initialDeparture = initialSegment.departure.at;
    const finalArrival = finalSegment.arrival.at;
  
    const departureAirport: Airport = {
      name: dictionaries.locations[initialSegment.departure.iataCode].cityCode,
      code: initialSegment.departure.iataCode
    };
  
    const arrivalAirport: Airport = {
      name: dictionaries.locations[finalSegment.arrival.iataCode].cityCode,
      code: finalSegment.arrival.iataCode
    };
  
    const airline: Airline = {
      name: dictionaries.carriers[initialSegment.carrierCode],
      code: initialSegment.carrierCode
    };
  
    const operatingAirline: Airline | undefined = initialSegment.operating.carrierCode !== initialSegment.carrierCode ? {
      name: dictionaries.carriers[initialSegment.operating.carrierCode],
      code: initialSegment.operating.carrierCode
    } : undefined;
  
    const totalTime = flightOffer.itineraries.reduce((total, itinerary) => {
      const duration = itinerary.duration.match(/PT(\d+H)?(\d+M)?/);
      if(duration === null) return total + 0;

      const hours = duration[1] ? parseInt(duration[1].replace('H', '')) : 0;
      const minutes = duration[2] ? parseInt(duration[2].replace('M', '')) : 0;
      return total + (hours * 60) + minutes;
    }, 0);
  
    const stops: Stop[] = flightOffer.itineraries.flatMap(itinerary => 
      itinerary.segments.slice(1).map(segment => ({
        airport: {
          name: dictionaries.locations[segment.departure.iataCode].cityCode,
          code: segment.departure.iataCode
        },
        duration: segment.duration
      }))
    );
  
    const totalPrice = flightOffer.price.grandTotal;
    const pricePerTraveler = (parseFloat(totalPrice) / flightOffer.travelerPricings.length).toFixed(2);
  
    return {
      initialDeparture,
      finalArrival,
      departureAirport,
      arrivalAirport,
      airline,
      operatingAirline,
      totalTime: `${Math.floor(totalTime / 60)}H${totalTime % 60}M`,
      stops,
      totalPrice,
      pricePerTraveler
    };
  }
  

export type { FlightSummary, Airline, Stop };