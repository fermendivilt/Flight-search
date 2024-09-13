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
  setOriginalFlights: (dto: SearchResponseDTO) => void;
}

export default function SearchResults({
  search,
  backToSearch,
  toDetails,
  setOriginalFlights,
}: SearchResultsProps) {
  const oneWayTrip = search.departureDate === search.returnDate;
  const pageSize = oneWayTrip ? 4 : 3;
  const [sorting, setSorting] = useState<Sortings>("Default");

  const fetchFlights = useSearchFlights(search);
  const [flights, setFlights] = useState<
    Array<OneWayFlightSummary | RoundFlightSummary> | undefined
  >(undefined);
  const [flightsOnDisplay, setFlightsOnDisplay] = useState<
    Array<OneWayFlightSummary | RoundFlightSummary> | undefined
  >(undefined);
  const [totalFlightsFound, setTotalFlightsFound] = useState<
    number | undefined
  >(undefined);

  const loadingData =
    flights === undefined ||
    flightsOnDisplay === undefined ||
    fetchFlights.isLoading;

  useEffect(() => {
    if (fetchFlights.isLoading) return;

    if (fetchFlights.response !== undefined) {
      const response = fetchFlights.response;
      setOriginalFlights(response);
      setTotalFlightsFound(Math.ceil(response.meta.count / 5));
      const createFunc = oneWayTrip
        ? createOneWayFlightSummary
        : createRoundFlightSummary;
      const toFlightSummary = response.data.map((flightOffer, index) => {
        return createFunc(index, flightOffer, response.dictionaries);
      });
      setFlights(toFlightSummary);
    }

    if (fetchFlights.error !== undefined) {
      SweetMessage({
        title: "Something went wrong...",
        text: fetchFlights.error.message,
        icon: fetchFlights.error.fromServer ? "error" : "warning",
        toast: { position: "bottom-left", timerMs: 5000 },
      });
    }
  }, [fetchFlights.isLoading, fetchFlights.response, fetchFlights.error]);

  const setPage = (page: number) => {
    if (flights === undefined) return;

    const results: Array<OneWayFlightSummary | RoundFlightSummary> = [];
    const pageIndex = (page - 1) * pageSize;

    for (
      let index = pageIndex;
      index < pageIndex + pageSize && index < flights.length;
      index++
    ) {
      results.push(flights[index]);
    }

    setFlightsOnDisplay(results);
  };

  const setOrdering = (sorting: Sortings) => {
    if (flights === undefined) return;

    const modified = [...flights];

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

    setFlights(modified);
  };

  // const sortedFlights = useMemo(() => {
  //   setOrdering(sorting);
  // }, [sorting]);

  useEffect(() => {
    setPage(1);
  }, [flights]);

  useEffect(() => {
    setOrdering(sorting);
  }, [sorting]);

  return (
    <>
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

        {loadingData &&
          Array.from({ length: pageSize }).map((value, key) => (
            <Paper key={key} elevation={5} sx={{ padding: 3 }}>
              <Skeleton variant="rounded" height={oneWayTrip ? 96 : 190} />
            </Paper>
          ))}

        {!loadingData &&
          oneWayTrip &&
          flightsOnDisplay.map((value, key) => (
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
          flightsOnDisplay.map((value, key) => (
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
          count={totalFlightsFound ?? 0}
          defaultPage={1}
          sx={{ display: "flex", justifyContent: "center" }}
          showFirstButton
          showLastButton
          onChange={(_e, page) => setPage(page)}
        />
      </Stack>
    </>
  );
}
