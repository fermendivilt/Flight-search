interface FlightOffer {
  type: string;
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  isUpsellOffer: boolean;
  lastTicketingDate: string;
  lastTicketingDateTime: string;
  numberOfBookableSeats: number;
  itineraries: Itinerary[];
  price: Price;
  pricingOptions: PricingOptions;
  validatingAirlineCodes: string[];
  travelerPricings: TravelerPricing[];
}

interface Itinerary {
  duration: string;
  segments: Segment[];
}

interface Segment {
  departure: Location;
  arrival: Location;
  carrierCode: string;
  number: string;
  aircraft: Aircraft;
  operating: Operating;
  duration: string;
  id: string;
  numberOfStops: number;
  blacklistedInEU: boolean;
}

interface Location {
  iataCode: string;
  at: string;
  terminal?: string;
}

interface Aircraft {
  code: string;
}

interface Operating {
  carrierCode: string;
}

interface Price {
  currency: string;
  total: string;
  base: string;
  fees: Fee[];
  grandTotal: string;
}

interface Fee {
  amount: string;
  type: string;
}

interface PricingOptions {
  fareType: string[];
  includedCheckedBagsOnly: boolean;
}

interface TravelerPricing {
  travelerId: string;
  fareOption: string;
  travelerType: string;
  price: Price;
  fareDetailsBySegment: FareDetailsBySegment[];
}

interface FareDetailsBySegment {
  segmentId: string;
  cabin: string;
  fareBasis: string;
  brandedFare: string;
  brandedFareLabel: string;
  class: string;
  includedCheckedBags: IncludedCheckedBags;
  amenities: Amenity[];
}

interface IncludedCheckedBags {
  quantity: number;
}

interface Amenity {
  description: string;
  isChargeable: boolean;
  amenityType: string;
  amenityProvider: AmenityProvider;
}

interface AmenityProvider {
  name: string;
}

interface Meta {
  count: number;
  links: Links;
}

interface Links {
  self: string;
}

interface Dictionaries {
  locations: { [key: string]: LocationDetails };
  aircraft: { [key: string]: string };
  currencies: { [key: string]: string };
  carriers: { [key: string]: string };
}

interface LocationDetails {
  cityCode: string;
  countryCode: string;
}

interface SearchResponseDTO {
  meta: Meta;
  data: FlightOffer[];
  dictionaries: Dictionaries;
}

export type { SearchResponseDTO, FlightOffer, Itinerary, Dictionaries }