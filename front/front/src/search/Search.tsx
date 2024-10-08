import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Input,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  SearchDTO,
  SearchDTOValidation,
  ValidateSearchDTO,
} from "../dto/SearchDTO";
import { useGetAirports } from "../requester/Requester";
import AutocompleteInput, {
  Option,
  OptionList,
} from "../components/AutocompleteInput";
import { useEnvConfigContext } from "../hooks/EnvConfig";
import { SweetMessage } from "../components/SweetAlert";

interface SearchProps {
  search: SearchDTO;
  setSearch: (value: SearchDTO) => void;
  moveToResults: () => void;
}

interface SearchState {
  validation: SearchDTOValidation;
  departureAirports: OptionList;
  arrivalAirports: OptionList;
}

const currencyList: Array<Option> = [
  { id: 0, displayName: "United States Dollar", code: "USD" },
  { id: 1, displayName: "Mexican Peso", code: "MXN" },
  { id: 2, displayName: "Euro", code: "EUR" },
];

const currencies = {
  options: currencyList,
  getOptionLabel: (option: Option) => option.displayName,
};

export default function Search({
  search,
  setSearch,
  moveToResults,
}: SearchProps) {
  const appConfig = useEnvConfigContext();

  const fetchDepartureAirports = useGetAirports("");
  const fetchArrivalAirports = useGetAirports("");

  const [state, setState] = useState<SearchState>({
    validation: {
      hasError: false,
      departureAirportError: "",
      arrivalAirportError: "",
      departureDateError: "",
      arrivalDateError: "",
      adultsError: "",
      currencyError: "",
    },
    departureAirports: {
      options: [],
      getOptionLabel: (option: Option) => option.displayName,
    },
    arrivalAirports: {
      options: [],
      getOptionLabel: (option: Option) => option.displayName,
    },
  });

  const { validation, departureAirports, arrivalAirports } = state;

  const validateAirportSearch = (
    value: string,
    setUrl: (url: string) => void
  ) => {
    if (
      new RegExp("^[\u0020A-Za-z0-9./:()'\"-]+$").test(value) ||
      value.length === 0
    )
      setUrl(value);
    else
      SweetMessage({
        title: "Detected invalid character",
        text: "Only English letters, numbers and certain characters are valid",
        icon: "warning",
        position: "top",
        toast: { timerMs: 2000 },
      });
  };

  function validate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const result = ValidateSearchDTO(search);

    setState((prev) => ({ ...prev, validation: result }));

    if (!result.hasError) {
      const url: URL = new URL(window.location.href);
      Object.entries(search).forEach((pair) => {
        if (pair[1].toString().length === 0) return;
        url.searchParams.set(pair[0], pair[1].toString());
      });
      window.history.pushState({}, "", url);

      moveToResults();
    }
  }

  useEffect(() => {
    if (fetchDepartureAirports.isLoading) return;

    if (fetchDepartureAirports.response !== undefined) {
      const response = fetchDepartureAirports.response;
      setState((prev) => ({
        ...prev,
        departureAirports: {
          ...prev.departureAirports,
          options: response.map((x, index) => {
            return {
              id: index,
              displayName: x.name + ", " + x.country,
              code: x.iataCode,
            };
          }),
        },
      }));
    }

    if (fetchDepartureAirports.error !== undefined) {
      SweetMessage({
        title: "Something went wrong...",
        text: fetchDepartureAirports.error.message,
        icon: fetchDepartureAirports.error.fromServer ? "error" : "warning",
        position: "bottom-left",
        toast: { timerMs: 5000 },
      });
    }
  }, [
    fetchDepartureAirports.isLoading,
    fetchDepartureAirports.response,
    fetchDepartureAirports.error,
  ]);

  useEffect(() => {
    if (fetchArrivalAirports.isLoading) return;

    if (fetchArrivalAirports.response !== undefined) {
      const response = fetchArrivalAirports.response;
      setState((prev) => ({
        ...prev,
        arrivalAirports: {
          ...prev.arrivalAirports,
          options: response.map((x, index) => {
            return {
              id: index,
              displayName: x.name + ", " + x.country,
              code: x.iataCode,
            };
          }),
        },
      }));
    }

    if (fetchArrivalAirports.error !== undefined) {
      SweetMessage({
        title: "Something went wrong...",
        text: fetchArrivalAirports.error.message,
        icon: fetchArrivalAirports.error.fromServer ? "error" : "warning",
        position: "bottom-left",
        toast: { timerMs: 5000 },
      });
    }
  }, [
    fetchArrivalAirports.isLoading,
    fetchArrivalAirports.response,
    fetchArrivalAirports.error,
  ]);

  const handleDepartureAirportChange = (value: Option | null) => {
    if (value == null) return;

    setSearch({
      ...search,
      departureAirport: value.code,
    });
  };
  const handleArrivalAirportChange = (value: Option | null) => {
    if (value == null) return;

    setSearch({
      ...search,
      arrivalAirport: value.code,
    });
  };
  const handleDepartureDateChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const compare =
      new Date(Date.parse(event.target.value)) >
      new Date(Date.parse(search.returnDate))
        ? event.target.value
        : search.returnDate;
    setSearch({
      ...search,
      departureDate: event.target.value,
      returnDate: compare,
    });
  };
  const handleArrivalDateChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearch({
      ...search,
      returnDate: event.target.value,
    });
  };
  const handleAdultsChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let value: number = Number.parseInt(event.target.value);

    setSearch({
      ...search,
      adults: value,
    });
  };
  const handleCurrencyChange = (value: Option | null) => {
    if (value == null) return;

    setSearch({
      ...search,
      currency: value.code,
    });
  };
  const handleNonStopChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch({
      ...search,
      nonStop: event.target.checked,
    });
  };

  return (
    <>
      <Paper elevation={24} sx={{ padding: 8 }}>
        <form id="searchForm" onSubmit={validate}>
          <Grid2 container gap={4}>
            <Grid2 size={12}>
              <Typography variant="h3" gutterBottom align="center">
                Flight Search
              </Typography>
              <Typography variant="body2" gutterBottom align="center">
                {process.env.NODE_ENV !== "production" && (
                  <>{process.env.NODE_ENV}</>
                )}{" "}
                v{appConfig.appVersion}
              </Typography>
            </Grid2>

            <AutocompleteInput
              label="Departure airport"
              id="DepartureAirport"
              loading={fetchDepartureAirports.isLoading}
              options={departureAirports}
              handleType={(value: string) =>
                validateAirportSearch(value, fetchDepartureAirports.setUrl)
              }
              handleSelect={handleDepartureAirportChange}
              validationError={validation.departureAirportError}
            />

            <AutocompleteInput
              label="Arrival airport"
              id="ArrivalAirport"
              loading={fetchArrivalAirports.isLoading}
              options={arrivalAirports}
              handleType={(value: string) =>
                validateAirportSearch(value, fetchArrivalAirports.setUrl)
              }
              handleSelect={handleArrivalAirportChange}
              validationError={validation.arrivalAirportError}
            />

            <Grid2 size={5}>
              <Typography variant="h5" align="right">
                <label htmlFor="DepartureDate">Departure date</label>
              </Typography>
            </Grid2>

            <Grid2 size={6}>
              <Input
                type="date"
                fullWidth
                id="DepartureDate"
                value={search.departureDate}
                onChange={handleDepartureDateChange}
              />
              <Typography variant="caption" className="error">
                {validation.departureDateError}
              </Typography>
            </Grid2>

            <Grid2 size={5}>
              <Typography variant="h5" align="right">
                <label htmlFor="ArrivalDate">Arrival date</label>
              </Typography>
            </Grid2>

            <Grid2 size={6}>
              <Input
                type="date"
                fullWidth
                id="ArrivalDate"
                value={search.returnDate}
                onChange={handleArrivalDateChange}
              />
              <Typography variant="caption" className="error">
                {validation.arrivalDateError}
              </Typography>
            </Grid2>

            <Grid2 size={5}>
              <Typography variant="h5" align="right">
                <label htmlFor="adults">Number of adults</label>
              </Typography>
            </Grid2>

            <Grid2 size={6}>
              <Input
                type="number"
                fullWidth
                id="adults"
                value={search.adults}
                onChange={handleAdultsChange}
              />
              <Typography variant="caption" className="error">
                {validation.adultsError}
              </Typography>
            </Grid2>

            <Grid2 size={5}>
              <Typography variant="h5" align="right">
                <label htmlFor="Currency">Currency</label>
              </Typography>
            </Grid2>

            <Grid2 size={6}>
              <Autocomplete
                {...currencies}
                id="Currency"
                selectOnFocus
                blurOnSelect
                clearOnBlur
                handleHomeEndKeys
                renderInput={(params) => (
                  <TextField {...params} label="Search" variant="outlined" />
                )}
                onChange={(_e, value, _r, _d) => handleCurrencyChange(value)}
              />
              <Typography variant="caption" className="error">
                {validation.currencyError}
              </Typography>
            </Grid2>

            <Grid2 size={5}></Grid2>

            <Grid2 size={6}>
              <Checkbox
                onChange={handleNonStopChange}
                sx={{ paddingLeft: 0 }}
              />{" "}
              Non-stop
            </Grid2>
          </Grid2>

          <Box display="flex" justifyContent="end">
            <Button type="submit" form="searchForm" variant="contained">
              Search
            </Button>
          </Box>
        </form>
      </Paper>
    </>
  );
}
