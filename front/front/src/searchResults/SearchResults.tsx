import {
  Button,
  Divider,
  MenuItem,
  Pagination,
  Paper,
  Select,
  SelectChangeEvent,
  Skeleton,
  Stack,
} from "@mui/material";
import { SearchDTO } from "../dto/SearchDTO";
import { useSearchFlights } from "../requester/Requester";
import { useEffect, useState } from "react";
import { ArrowBackIosNew } from "@mui/icons-material";
import OneWayFlight from "../components/OneWayFlight";
import TwoWayFlight from "../components/TwoWayFlight";
import {
  createOneWayFlightSummary,
  createRoundFlightSummary,
  OneWayFlightSummary,
  RoundFlightSummary,
} from "../types/Flights";
import { Sortings } from "../literals/Sortings";
import { SearchResponseDTO } from "../dto/SearchResponseDTO";
import { SweetMessage } from "../components/SweetAlert";

interface SearchResultsProps {
  search: SearchDTO;
  backToSearch: () => void;
  toDetails: (selectedFlight: number) => void;
  originalFlights: SearchResponseDTO | undefined;
  setOriginalFlights: (dto: SearchResponseDTO) => void;
  sorting: Sortings;
  setSorting: (sorting: Sortings) => void;
  searchResultsPage: number;
  setSearchResultsPage: (page: number) => void;
}

interface SearchResultsState {
  reorderedFlights: Array<OneWayFlightSummary | RoundFlightSummary> | undefined;
  displayedFlights: Array<OneWayFlightSummary | RoundFlightSummary> | undefined;
}

export default function SearchResults({
  search,
  backToSearch,
  toDetails,
  originalFlights,
  setOriginalFlights,
  sorting,
  setSorting,
  searchResultsPage,
  setSearchResultsPage,
}: SearchResultsProps) {
  const oneWayTrip = search.returnDate.length === 0;
  const pageSize = oneWayTrip ? 4 : 3;
  const fetchFlights = useSearchFlights(search, originalFlights);

  const [state, setState] = useState<SearchResultsState>({
    reorderedFlights: undefined,
    displayedFlights: undefined,
  });

  const { reorderedFlights, displayedFlights } = state;

  const loadingData =
    reorderedFlights === undefined ||
    displayedFlights === undefined ||
    fetchFlights.isLoading;

  const setFetchedFlights = () => {
    if (fetchFlights.response !== undefined) {
      const response = fetchFlights.response;
      setOriginalFlights(response);

      if (response.meta.count < 1) {
        SweetMessage({
          title: "No flights found for your search parameters.",
          icon: "info",
          confirm: { buttonText: "Back to search", onConfirm: backToSearch },
        });
      }

      setFlightSummaries(response);
    }

    if (fetchFlights.error !== undefined) {
      SweetMessage({
        title: "Something went wrong...",
        text: fetchFlights.error.message,
        icon: fetchFlights.error.fromServer ? "error" : "warning",
        confirm: {
          buttonText: "Try with another search",
          onConfirm: backToSearch,
        },
      });
    }
  };

  const setFlightSummaries = (searchResponse: SearchResponseDTO) => {
    const createFunc = oneWayTrip
      ? createOneWayFlightSummary
      : createRoundFlightSummary;
    const toFlightSummary = searchResponse.data.map((flightOffer, index) => {
      return createFunc(index, flightOffer, searchResponse.dictionaries);
    });
    setState((prev) => ({ ...prev, reorderedFlights: toFlightSummary }));
  };

  useEffect(() => {
    if (fetchFlights.isLoading) return;

    if (originalFlights !== undefined) {
      setFlightSummaries(originalFlights);
    } else {
      setFetchedFlights();
    }
  }, [fetchFlights.isLoading, fetchFlights.response, fetchFlights.error]);

  const setPage = (page: number) => {
    if (reorderedFlights === undefined) return;

    const results: Array<OneWayFlightSummary | RoundFlightSummary> = [];
    const pageIndex = (page - 1) * pageSize;

    for (
      let index = pageIndex;
      index < pageIndex + pageSize && index < reorderedFlights.length;
      index++
    ) {
      results.push(reorderedFlights[index]);
    }

    setState((prev) => ({ ...prev, displayedFlights: results }));
  };

  const setOrdering = (sorting: Sortings) => {
    if (reorderedFlights === undefined) return;

    const modified = [...reorderedFlights];

    switch (sorting) {
      case "PriceAscending":
        modified.sort(
          (a, b) =>
            parseFloat(a.forwardFlight.totalPrice) -
            parseFloat(b.forwardFlight.totalPrice)
        );
        break;
      case "PriceDescending":
        modified.sort(
          (a, b) =>
            parseFloat(b.forwardFlight.totalPrice) -
            parseFloat(a.forwardFlight.totalPrice)
        );
        break;
      case "DurationAscending":
        modified.sort(
          (a, b) => a.forwardFlight.totalMinutes - b.forwardFlight.totalMinutes
        );
        break;
      case "DurationDescending":
        modified.sort(
          (a, b) => b.forwardFlight.totalMinutes - a.forwardFlight.totalMinutes
        );
        break;
      case "Default":
      default:
        break;
    }

    setState((prev) => ({ ...prev, reorderedFlights: modified }));
  };

  useEffect(() => {
    setPage(searchResultsPage);
    console.log(`Reordered page ${searchResultsPage}`);
  }, [reorderedFlights, searchResultsPage]);

  useEffect(() => {
    setOrdering(sorting);
    console.log(`Sorting ${sorting}`);
  }, [sorting]);

  return (
    <Stack
      divider={<CustomDivider />}
      spacing={2}
      sx={{ maxHeight: "95vh", paddingY: 2 }}
    >
      <Paper sx={{ paddingY: 1, paddingX: 2 }}>
        <Stack
          direction={"row"}
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Button variant="outlined" onClick={backToSearch}>
            <ArrowBackIosNew /> Return to search
          </Button>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={sorting}
            label="Age"
            onChange={(event: SelectChangeEvent) => {
              setSorting(event.target.value as Sortings);
            }}
          >
            <MenuItem value={"Default"}>Default</MenuItem>
            <MenuItem value={"PriceAscending"}>Price ascending</MenuItem>
            <MenuItem value={"DurationAscending"}>Duration: ascending</MenuItem>
            <MenuItem value={"PriceDescending"}>Price: descending</MenuItem>
            <MenuItem value={"DurationDescending"}>
              Duration: descending
            </MenuItem>
          </Select>
        </Stack>
      </Paper>

      <Stack
        divider={<CustomDivider />}
        spacing={2}
        sx={{ display: "block", overflowY: "auto" }}
      >
        {loadingData &&
          Array.from({ length: pageSize }).map((value, key) => (
            <Paper key={key} elevation={5} sx={{ padding: 3 }}>
              <Skeleton variant="rounded" height={oneWayTrip ? 96 : 190} />
            </Paper>
          ))}

        {!loadingData &&
          oneWayTrip &&
          displayedFlights?.map((value, key) => (
            <OneWayFlight
              key={key}
              {...{
                id: value.id,
                currency: search.currency,
                forwardFlight: value.forwardFlight,
              }}
              onClick={() => toDetails(value.id)}
            />
          ))}

        {!loadingData &&
          !oneWayTrip &&
          displayedFlights?.map((value, key) => (
            <TwoWayFlight
              key={key}
              {...{
                id: value.id,
                currency: search.currency,
                forwardFlight: value.forwardFlight,
                returnFlight: (value as RoundFlightSummary).returnFlight,
              }}
              onClick={() => toDetails(value.id)}
            />
          ))}
      </Stack>

      <Pagination
        count={Math.ceil((reorderedFlights?.length ?? 0) / 5)}
        defaultPage={searchResultsPage}
        sx={{ display: "flex", justifyContent: "center" }}
        showFirstButton
        showLastButton
        onChange={(_e, page) => setSearchResultsPage(page)}
      />
    </Stack>
  );
}

function CustomDivider() {
  return <Divider sx={{ borderColor: "white" }} />;
}
