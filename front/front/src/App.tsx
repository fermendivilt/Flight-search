import { useEffect, useState } from "react";
import "./App.css";
import { Container } from "@mui/material";
import Search from "./search/Search";
import SearchResults from "./searchResults/SearchResults";
import { EmptySearchDTO, SearchDTO, ValidateSearchDTO } from "./dto/SearchDTO";
import {
  NotNullBoolean,
  NotNullNumber,
  NotNullString,
} from "./utils/NullUtils";
import FlightDetails from "./flightDetails/FlightDetails";
import { FlightOffer, SearchResponseDTO } from "./dto/SearchResponseDTO";

type Page = "search" | "results" | "details";

const clearParams = () => (window.location.search = "");

const getParams = (params?: URLSearchParams): SearchDTO => {
  if (params === undefined)
    params = new URLSearchParams(window.location.search);

  return {
    departureAirport: NotNullString(params.get("departureAirport")),
    arrivalAirport: NotNullString(params.get("arrivalAirport")),
    departureDate: NotNullString(params.get("departureDate")),
    returnDate: NotNullString(params.get("returnDate")),
    adults: NotNullNumber(params.get("adults")),
    currency: NotNullString(params.get("currency")),
    nonStop: NotNullBoolean(params.get("nonStop")),
  };
};

interface AppState {
  search: SearchDTO;
  page: Page;
  flights: SearchResponseDTO | undefined;
  flight: FlightOffer | undefined;
}

function App() {
  const [state, setState] = useState<AppState>({
    search: EmptySearchDTO(),
    page: "search",
    flights: undefined,
    flight: undefined,
  });

  const { search, page, flights, flight } = state;

  const setSearch = (value: SearchDTO) => {
    setState((prev) => ({
      ...prev,
      search: value,
    }));
  };
  const setPage = (value: Page) => {
    setState((prev) => ({
      ...prev,
      page: value,
    }));
  };
  const setFlights = (value: SearchResponseDTO) => {
    setState((prev) => ({
      ...prev,
      flights: value,
    }));
  };

  const checkUrlForSearch = (): boolean => {
    const params: URLSearchParams = new URLSearchParams(window.location.search);

    if (params.size !== 7) return false;

    const parsedDto = getParams(params);

    if (ValidateSearchDTO(parsedDto).hasError) {
      clearParams();
      return false;
    }

    setState((prev) => ({ ...prev, search: parsedDto }));

    return true;
  };

  const backToSearch = () => {
    setState((prev) => ({ ...prev, flights: undefined, search: getParams(), page: "search" }));
    clearParams();
  };

  const toDetails = (flightId: number) => {
    if (flights === undefined) return;

    const flight = flights.data[flightId];
    setState((prev) => ({ ...prev, page: "details", flight: flight }));
  };

  const backToResults = () => {
    setState((prev) => ({ ...prev, page: "results", flight: undefined }));
  };

  useEffect(() => {
    if (checkUrlForSearch()) setState((prev) => ({ ...prev, page: "results" }));
  }, []);

  return (
    <Container fixed sx={{ height: "100vh", alignContent: "center" }}>
      {page === "search" && (
        <Search
          search={search}
          setSearch={setSearch}
          moveToResults={() => setPage("results")}
        />
      )}
      {page === "results" && (
        <SearchResults
          search={search}
          backToSearch={backToSearch}
          toDetails={(selectedFlight: number) => toDetails(selectedFlight)}
          originalFlights={flights}
          setOriginalFlights={(dto: SearchResponseDTO) => setFlights(dto)}
        />
      )}
      {page === "details" &&
        flight !== undefined &&
        flights !== undefined &&
        flights.dictionaries !== undefined && (
          <FlightDetails
            flights={flight}
            dictionary={flights.dictionaries}
            backToResults={backToResults}
          />
        )}
    </Container>
  );
}

export default App;
