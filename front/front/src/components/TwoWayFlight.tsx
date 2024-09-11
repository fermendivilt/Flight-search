import { Paper, Typography, Divider } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Flight from "./IndividualFlight";
import FlightCosts from "./FlightCosts";
import { RoundFlightSummary } from "../types/Flights";
import styled from "@emotion/styled";
import { useState } from "react";

interface TwoWayFlightProps extends RoundFlightSummary {
  currency: string;
  onClick: () => void;
}

const StyledPaper = styled(Paper)({
  position: "relative",
  overflow: "hidden",
  cursor: "pointer",
});

const BrightnessOverlay = styled("div")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  transition: "background 0.3s ease",
});

export default function TwoWayFlight(props: TwoWayFlightProps) {
  const [hover, setHover] = useState(false);

  return (
    <StyledPaper
      elevation={5}
      sx={{ padding: 3 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={props.onClick}
    >
      <BrightnessOverlay
        style={hover ? { animation: "wave 0.1s forwards" } : {}}
      />
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
    </StyledPaper>
  );
}
