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

type Page = "search" | "results" | "details";

const clearParams = () => (window.location.search = "");

function App() {
  const [search, setSearch] = useState<SearchDTO>(EmptySearchDTO());
  const [page, setPage] = useState<Page>("search");

  const checkUrlForSearch = (): boolean => {
    const params: URLSearchParams = new URLSearchParams(window.location.search);

    if (params.size !== 7) return false;

    const fromParams: SearchDTO = {
      departureAirport: NotNullString(params.get("departureAirport")),
      arrivalAirport: NotNullString(params.get("arrivalAirport")),
      departureDate: NotNullString(params.get("departureDate")),
      returnDate: NotNullString(params.get("returnDate")),
      adults: NotNullNumber(params.get("adults")),
      currency: NotNullString(params.get("currency")),
      nonStop: NotNullBoolean(params.get("nonStop")),
    };

    if (ValidateSearchDTO(fromParams).hasError) {
      clearParams();
      return false;
    }

    setSearch(() => {
      return {
        ...fromParams,
      };
    });

    return true;
  };

  const backToSearch = () => {
    clearParams();
    setPage("search");
  };

  const toDetails = () => {
    setPage("details");
  };

  useEffect(() => {
    if (checkUrlForSearch()) setPage("results");
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
          toDetails={toDetails}
        />
      )}
      {page === "details" && <FlightDetails />}
    </Container>
  );
}

export default App;
