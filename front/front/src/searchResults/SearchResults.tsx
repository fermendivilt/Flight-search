import {
  Button,
  Divider,
  Pagination,
  Paper,
  Skeleton,
  Stack,
} from "@mui/material";
import { SearchDTO } from "../dto/SearchDTO";
import { useSearchFlights } from "../requester/Requester";
import { useEffect, useState } from "react";
import { ArrowBackIosNew } from "@mui/icons-material";
import OneWayFlight from "../components/OneWayFlight";
import TwoWayFlight from "../components/TwoWayFlight";
import FastSnackbar from "../components/Snackbar";
import {
  createOneWayFlightSummary,
  createRoundFlightSummary,
  OneWayFlightSummary,
  RoundFlightSummary,
} from "../types/Flights";

interface SearchResultsProps {
  search: SearchDTO;
  backToSearch: () => void;
}

export default function SearchResults({
  search,
  backToSearch,
}: SearchResultsProps) {
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const oneWayTrip = search.departureDate === search.returnDate;
  const pageSize = oneWayTrip ? 4 : 3;

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
      setTotalFlightsFound(Math.ceil(response.meta.count / 5));
      const createFunc = oneWayTrip
        ? createOneWayFlightSummary
        : createRoundFlightSummary;
      const toFlightSummary = response.data.map((flightOffer) => {
        return createFunc(flightOffer, response.dictionaries);
      });
      setFlights(toFlightSummary);
    }

    if (fetchFlights.error !== undefined) {
      setSnackbarMessage(fetchFlights.error);
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

  useEffect(() => {
    setPage(1);
  }, [flights]);

  return (
    <>
      <Stack divider={<Divider flexItem />} spacing={2} sx={{ paddingY: 2 }}>
        <Stack direction={"row"}>
          <Button variant="outlined" onClick={backToSearch}>
            <ArrowBackIosNew /> Return to search
          </Button>
        </Stack>

        {loadingData &&
          Array.from({ length: pageSize }).map(() => (
            <Paper elevation={5} sx={{ padding: 3 }}>
              <Skeleton variant="rounded" height={oneWayTrip ? 96 : 190} />
            </Paper>
          ))}

        {!loadingData &&
          oneWayTrip &&
          flightsOnDisplay.map((value, key) => (
            <OneWayFlight
              key={key}
              {...{ currency: search.currency, ...value.forwardFlight }}
            />
          ))}

        {!loadingData &&
          !oneWayTrip &&
          flightsOnDisplay.map((value, key) => (
            <TwoWayFlight
              key={key}
              {...{
                currency: search.currency,
                forwardFlight: value.forwardFlight,
                returnFlight: (value as RoundFlightSummary).returnFlight,
              }}
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
      {snackbarMessage.length > 0 && (
        <FastSnackbar
          message={snackbarMessage}
          onDead={() => setSnackbarMessage("")}
        />
      )}
    </>
  );
}
