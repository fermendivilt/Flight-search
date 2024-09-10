import { Typography, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Stop } from "../types/Flights";
import { DateTo12H } from "../utils/TimeUtils";

interface FlightProps {
  departureName: string;
  departureTime: Date;
  departureCode: string;
  arrivalName: string;
  arrivalTime: Date;
  arrivalCode: string;
  totalDuration: string;
  stops: Stop[];
  airlineName: string;
  airlineCode: string;
}

export default function Flight({
  departureName,
  departureTime,
  departureCode,
  arrivalName,
  arrivalTime,
  arrivalCode,
  totalDuration,
  stops,
  airlineName,
  airlineCode,
}: FlightProps) {
  return (
    <>
      <Grid size={12}>
        <Typography variant="body1">
          {DateTo12H(departureTime)} - {DateTo12H(arrivalTime)}
        </Typography>
      </Grid>
      <Grid container size={12}>
        <Grid size={6}>
          <Typography variant="body1">
            {departureName} ({departureCode}) - {arrivalName} ({arrivalCode})
          </Typography>
        </Grid>
        <Grid size={6}>
          <Stack>
            <Typography variant="body1">
              {totalDuration}{" "}
              {stops.length > 0 && <>({stops.length} stop(s))</>}
              {stops.length === 0 && <>(Nonstop)</>}
            </Typography>
            {stops.map((value, index) => (
              <Typography key={index} variant="body1">
                {value.duration} in {value.airport.name} (
                {value.airport.code})
              </Typography>
            ))}
          </Stack>
        </Grid>
      </Grid>
      <Grid size={12}>
        <Typography variant="body1">{airlineName} ({airlineCode})</Typography>
      </Grid>
    </>
  );
}
