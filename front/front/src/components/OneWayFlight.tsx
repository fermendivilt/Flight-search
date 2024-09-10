import { Paper } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Flight from "./IndividualFlight";
import FlightCosts from "./FlightCosts";
import { FlightSummary } from "../types/Flights";

interface OneWayFlightProps extends FlightSummary {
  currency: string;
}

export default function OneWayFlight(props: OneWayFlightProps) {
  return (
    <Paper elevation={5} sx={{ padding: 3 }}>
      <Grid container spacing={1}>
        <Grid size="grow" container>
          <Flight
            departureName={props.departureAirport.name}
            departureTime={new Date(Date.parse(props.initialDeparture))}
            departureCode={props.departureAirport.code}
            arrivalName={props.arrivalAirport.name}
            arrivalTime={new Date(Date.parse(props.finalArrival))}
            arrivalCode={props.arrivalAirport.code}
            totalDuration={props.totalTime}
            stops={props.stops}
            airlineName={props.airline.name}
            airlineCode={props.airline.code}
          />
        </Grid>
        <Grid
          size="auto"
          container
          sx={{ alignItems: "center", justifyContent: "center" }}
        >
          <FlightCosts
            currency={props.currency}
            totalPrice={props.totalPrice}
            pricePerTraveler={props.pricePerTraveler}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}