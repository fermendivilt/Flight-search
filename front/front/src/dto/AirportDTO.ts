type Airport = {
  name: string;
  country: string;
  iataCode: string;
};

type AirportDTO = Array<Airport>;

export type { AirportDTO };
