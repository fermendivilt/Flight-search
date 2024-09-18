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
}

interface SearchResultsState {
  sorting: Sortings;
  reorderedFlights: Array<OneWayFlightSummary | RoundFlightSummary> | undefined;
  displayedFlights: Array<OneWayFlightSummary | RoundFlightSummary> | undefined;
}

export default function SearchResults({
  search,
  backToSearch,
  toDetails,
  originalFlights,
  setOriginalFlights,
}: SearchResultsProps) {
  const oneWayTrip = search.departureDate === search.returnDate;
  const pageSize = oneWayTrip ? 4 : 3;
  const fetchFlights = useSearchFlights(search, originalFlights);

  const [state, setState] = useState<SearchResultsState>({
    sorting: "Default",
    reorderedFlights: undefined,
    displayedFlights: undefined,
  });

  const { sorting, reorderedFlights, displayedFlights } = state;

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
        position: "bottom-left",
        toast: { timerMs: 5000 },
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

    //setFlightsOnDisplay(results);
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
    setPage(1);
  }, [reorderedFlights]);

  useEffect(() => {
    setOrdering(sorting);
  }, [sorting]);

  return (
    <Stack divider={<Divider flexItem />} spacing={2} sx={{ paddingY: 2 }}>
      <Stack
        direction={"row"}
        sx={{ alignItems: "end", justifyContent: "space-between" }}
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
            setState((prev) => ({
              ...prev,
              sorting: event.target.value as Sortings,
            }));
          }}
        >
          <MenuItem value={"Default"}>Default</MenuItem>
          <MenuItem value={"PriceAscending"}>Price ascending</MenuItem>
          <MenuItem value={"DurationAscending"}>Duration: ascending</MenuItem>
          <MenuItem value={"PriceDescending"}>Price: descending</MenuItem>
          <MenuItem value={"DurationDescending"}>Duration: descending</MenuItem>
        </Select>
      </Stack>

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

      <Pagination
        count={Math.ceil((reorderedFlights?.length ?? 0) / 5)}
        defaultPage={1}
        sx={{ display: "flex", justifyContent: "center" }}
        showFirstButton
        showLastButton
        onChange={(_e, page) => setPage(page)}
      />
    </Stack>
  );
}
