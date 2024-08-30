import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { ChangeEvent, FormEvent, useState } from "react";
import { Currencies, SearchDTO, SearchDTOValidation, ValidateSearchDTO } from "../dto/SearchDTO";

interface SearchProps {
  search: SearchDTO;
  setSearch: React.Dispatch<React.SetStateAction<SearchDTO>>;
  moveToResults: () => void;
}

interface Select {
  name: string;
  code: string;
}

const airportDB: Array<Select> = [
  { name: "Aeropuerto internacional de Guadalajara", code: "GDL" },
  { name: "Aeropuerto de Cajeme", code: "CJM" },
  { name: "Aeropuerto internacional de Monterrey", code: "MTY" },
];

const currencyList: Array<Select> = [
  { name: "United States Dollar", code: Currencies[0] },
  { name: "Mexican Peso", code: Currencies[1] },
  { name: "Euro", code: Currencies[2] },
];

const airports = {
  options: airportDB,
  getOptionLabel: (option: Select) => option.name,
};

const currencies = {
  options: currencyList,
  getOptionLabel: (option: Select) => option.name,
};

export default function Search({ search, setSearch, moveToResults }: SearchProps) {
  
  const [validation, setValidation] = useState<SearchDTOValidation>({
    hasError: false,
    departureAirportError: "",
    arrivalAirportError: "",
    departureDateError: "",
    arrivalDateError: "",
    adultsError: "",
    currencyError: ""
  })
  function validate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const result = ValidateSearchDTO(search);

    setValidation(result);

    if(!result.hasError) {
      
      const url: URL = new URL(window.location.href);
      Object.entries(search).forEach(pair => url.searchParams.set(pair[0], pair[1].toString()));
      window.history.pushState({}, '', url);

      moveToResults();
    }
  }


  const handleDepartureAirportChange = (value: Select | null) => {
    if (value == null) return;

    setSearch((prev) => {
      return {
        ...prev,
        departureAirport: value.code,
      };
    });
  };
  const handleArrivalAirportChange = (value: Select | null) => {
    if (value == null) return;

    setSearch((prev) => {
      return {
        ...prev,
        arrivalAirport: value.code,
      };
    });
  };
  const handleDepartureDateChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearch((prev) => {
      return {
        ...prev,
        departureDate: event.target.value,
      };
    });
  };
  const handleArrivalDateChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearch((prev) => {
      return {
        ...prev,
        arrivalDate: event.target.value,
      };
    });
  };
  const handleAdultsChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let value: number = Number.parseInt(event.target.value);


    setSearch((prev) => {
      return {
        ...prev,
        adults: value
      };
    });
  };
  const handleCurrencyChange = (value: Select | null) => {
    if (value == null) return;

    setSearch((prev) => {
      return {
        ...prev,
        currency: value.code,
      };
    });
  };
  const handleNonStopChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch((prev) => {
      return {
        ...prev,
        nonStop: event.target.checked,
      };
    });
  };

  return (
    <form id="searchForm" onSubmit={validate}>
      <Grid2 container gap={4}>
        <Grid2 xs={12}>
          <Typography variant="h3" gutterBottom align="center">
            Flight Search
          </Typography>
        </Grid2>

        <Grid2 xs={5}>
          <Typography variant="h5" align="right">
            <label htmlFor="DepartureAirport">Departure airport</label>
          </Typography>
        </Grid2>

        <Grid2 xs={6}>
          <Autocomplete
            {...airports}
            id="DepartureAirport"
            selectOnFocus
            blurOnSelect
            clearOnBlur
            handleHomeEndKeys
            renderInput={(params) => (
              <TextField {...params} label="Search" variant="outlined" />
            )}
            onChange={(_e, value, _r, _d) =>
              handleDepartureAirportChange(value)
            }
          />
          <Typography variant="caption" className="error">
            {validation.departureAirportError}
          </Typography>
        </Grid2>

        <Grid2 xs={5}>
          <Typography variant="h5" align="right">
            <label htmlFor="ArrivalAirport">Arrival airport</label>
          </Typography>
        </Grid2>

        <Grid2 xs={6}>
          <Autocomplete
            {...airports}
            id="ArrivalAirport"
            selectOnFocus
            blurOnSelect
            clearOnBlur
            handleHomeEndKeys
            renderInput={(params) => (
              <TextField {...params} label="Search" variant="outlined" />
            )}
            onChange={(_e, value, _r, _d) => handleArrivalAirportChange(value)}
          />
          <Typography variant="caption" className="error">
            {validation.arrivalAirportError}
          </Typography>
        </Grid2>

        <Grid2 xs={5}>
          <Typography variant="h5" align="right">
            <label htmlFor="DepartureDate">Departure date</label>
          </Typography>
        </Grid2>

        <Grid2 xs={6}>
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

        <Grid2 xs={5}>
          <Typography variant="h5" align="right">
            <label htmlFor="ArrivalDate">Arrival date</label>
          </Typography>
        </Grid2>

        <Grid2 xs={6}>
          <Input
            type="date"
            fullWidth
            id="ArrivalDate"
            value={search.arrivalDate}
            onChange={handleArrivalDateChange}
          />
          <Typography variant="caption" className="error">
            {validation.arrivalDateError}
          </Typography>
        </Grid2>

        <Grid2 xs={5}>
          <Typography variant="h5" align="right">
            <label htmlFor="adults">Number of adults</label>
          </Typography>
        </Grid2>

        <Grid2 xs={6}>
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

        <Grid2 xs={5}>
          <Typography variant="h5" align="right">
            <label htmlFor="Currency">Currency</label>
          </Typography>
        </Grid2>

        <Grid2 xs={6}>
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

        <Grid2 xs={5}></Grid2>

        <Grid2 xs={6}>
          <Checkbox onChange={handleNonStopChange} sx={{ paddingLeft: 0 }} />{" "}
          Non-stop
        </Grid2>
      </Grid2>

      <Box display="flex" justifyContent="end">
        <Button type="submit" form="searchForm" variant="contained">
          Search
        </Button>
      </Box>
    </form>
  );
}
