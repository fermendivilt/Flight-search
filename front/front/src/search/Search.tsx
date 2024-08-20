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
import React, { ChangeEvent, useState } from "react";
import { TodayDate } from "../utils/StringToDate";

interface FilmOptionType {
  title: string;
  year: number;
}
interface SearchDTO {
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
  arrivalDate: string;
  currency: "USD" | "MXN";
  nonStop: boolean;
}
const top100Films = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Godfather: Part II", year: 1974 },
  { title: "The Dark Knight", year: 2008 },
];

export default function Search() {
  const defaultProps = {
    options: top100Films,
    getOptionLabel: (option: FilmOptionType) => option.title,
  };
  const flatProps = {
    options: top100Films.map((option) => option.title),
  };
  const [value, setValue] = React.useState<FilmOptionType | null>(null);
  const [search, setSearch] = useState<SearchDTO>({
    departureAirport: "",
    arrivalAirport: "",
    departureDate: TodayDate(),
    arrivalDate: TodayDate(),
    currency: "USD",
    nonStop: false,
  });

  const handleDateChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    isDeparture: boolean
  ) => {
    if (isDeparture) {
      setSearch((prev) => {
        return {
          ...prev,
          departureDate: event.target.value,
        };
      });
      console.log("value: " + event.target.value + "\nobject value: " + search.departureDate);
    } else {
      setSearch((prev) => {
        return {
          ...prev,
          arrivalDate: event.target.value,
        };
      });
      console.log("value: " + event.target.value + "\nobject value: " + search.arrivalDate);
    }
  };

  return (
    <>
      <Grid2 container gap={4}>
        <Grid2 xs={5}>
          <Typography variant="h5" align="right">
            <label htmlFor="DepartureAirport">Departure airport</label>
          </Typography>
        </Grid2>

        <Grid2 xs={6}>
          <Autocomplete
            {...defaultProps}
            id="DepartureAirport"
            selectOnFocus
            blurOnSelect
            clearOnBlur
            handleHomeEndKeys
            renderInput={(params) => (
              <TextField {...params} label="Search" variant="outlined" />
            )}
          />
        </Grid2>

        <Grid2 xs={5}>
          <Typography variant="h5" align="right">
            <label htmlFor="ArrivalAirport">Arrival airport</label>
          </Typography>
        </Grid2>

        <Grid2 xs={6}>
          <Autocomplete
            {...defaultProps}
            id="ArrivalAirport"
            selectOnFocus
            blurOnSelect
            clearOnBlur
            handleHomeEndKeys
            renderInput={(params) => (
              <TextField {...params} label="Search" variant="outlined" />
            )}
          />
        </Grid2>

        <Grid2 xs={5}>
          <Typography variant="h5" align="right">
            <label htmlFor="DepartureDate">Departure date</label>
          </Typography>
        </Grid2>

        <Grid2 xs={6}>
          <Input
            type="date"
            id="DepartureDate"
            value={search.departureDate}
            onChange={(e) => handleDateChange(e, true)}
          />
          <p>{search.departureDate}</p>
        </Grid2>

        <Grid2 xs={5}>
          <Typography variant="h5" align="right">
            <label htmlFor="ArrivalDate">Arrival date</label>
          </Typography>
        </Grid2>

        <Grid2 xs={6}>
          <Input
            type="date"
            id="ArrivalDate"
            value={search.arrivalDate}
            onChange={(e) => handleDateChange(e, false)}
          />
          <p>{search.arrivalDate}</p>
        </Grid2>

        <Grid2 xs={5}>
          <Typography variant="h5" align="right">
            <label htmlFor="Currency">Currency</label>
          </Typography>
        </Grid2>

        <Grid2 xs={6}>
          <Autocomplete
            {...defaultProps}
            id="Currency"
            selectOnFocus
            blurOnSelect
            clearOnBlur
            handleHomeEndKeys
            renderInput={(params) => (
              <TextField {...params} label="Search" variant="outlined" />
            )}
          />
        </Grid2>

        <Grid2 xs={5}></Grid2>

        <Grid2 xs={6}>
          <Checkbox sx={{ paddingLeft: 0 }} /> Non-stop
        </Grid2>
      </Grid2>
      <Box display="flex" justifyContent="end">
        <Button variant="contained">Search</Button>
      </Box>
    </>
  );
}
