import { useEffect, useState } from "react";
import "./App.css";
import { Container, Paper } from "@mui/material";
import Search from "./search/Search";
import SearchResults from "./searchResults/SearchResults";
import { EmptySearchDTO, SearchDTO, ValidateSearchDTO } from "./dto/SearchDTO";
import {
  NotNullBoolean,
  NotNullNumber,
  NotNullString,
} from "./utils/NullUtils";

type Page = "search" | "results" | "details";

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
      arrivalDate: NotNullString(params.get("arrivalDate")),
      adults: NotNullNumber(params.get("adults")),
      currency: NotNullString(params.get("currency")),
      nonStop: NotNullBoolean(params.get("nonStop")),
    };

    if (ValidateSearchDTO(fromParams).hasError) {
      window.location.search = "";
      return false;
    }

    setSearch(() => {
      return {
        ...fromParams,
      };
    });

    return true;
  };

  useEffect(() => {
    if (checkUrlForSearch()) setPage("results");
  }, []);

  return (
    <Container fixed sx={{ height: "100vh", alignContent: "center" }}>
      <Paper elevation={24} sx={{ padding: 8 }}>
        {page === "search" && (
          <Search
            search={search}
            setSearch={setSearch}
            moveToResults={() => setPage("results")}
          />
        )}
        {page === "results" && <SearchResults search={search} />}
        {page === "details" && <p>Details</p>}
      </Paper>
    </Container>
  );
}

export default App;
