import { Paper, Typography, Divider } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Flight from "./IndividualFlight";
import FlightCosts from "./FlightCosts";
import { RoundFlightSummary } from "../types/Flights";

interface TwoWayFlightProps extends RoundFlightSummary {
  currency: string;
}

export default function TwoWayFlight(props: TwoWayFlightProps) {
  return (
    <Paper elevation={5} sx={{ padding: 3 }}>
      <Grid container>
        <Grid size="grow" container>
          <Flight
            departureName={props.forwardFlight.departureAirport.name}
            departureTime={
              new Date(Date.parse(props.forwardFlight.initialDeparture))
            }
            departureCode={props.forwardFlight.departureAirport.code}
            arrivalName={props.forwardFlight.arrivalAirport.name}
            arrivalTime={new Date(Date.parse(props.forwardFlight.finalArrival))}
            arrivalCode={props.forwardFlight.arrivalAirport.code}
            totalDuration={props.forwardFlight.totalTime}
            stops={props.forwardFlight.stops}
            airlineName={props.forwardFlight.airline.name}
            airlineCode={props.forwardFlight.airline.code}
          />

          <Grid size={12} sx={{ marginY: 2 }}>
            <Divider>
              <Typography variant="body2">Return</Typography>
            </Divider>
          </Grid>

          <Flight 
            departureName={props.returnFlight.departureAirport.name}
            departureTime={
              new Date(Date.parse(props.returnFlight.initialDeparture))
            }
            departureCode={props.returnFlight.departureAirport.code}
            arrivalName={props.returnFlight.arrivalAirport.name}
            arrivalTime={new Date(Date.parse(props.returnFlight.finalArrival))}
            arrivalCode={props.returnFlight.arrivalAirport.code}
            totalDuration={props.returnFlight.totalTime}
            stops={props.returnFlight.stops}
            airlineName={props.returnFlight.airline.name}
            airlineCode={props.returnFlight.airline.code}
            />
        </Grid>
        <Grid size="auto">
          <Divider orientation="vertical" />
        </Grid>
        <Grid
          size="auto"
          container
          sx={{ alignItems: "center", justifyContent: "center" }}
        >
          <FlightCosts
            currency={props.currency}
            totalPrice={props.forwardFlight.totalPrice}
            pricePerTraveler={props.forwardFlight.pricePerTraveler}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
