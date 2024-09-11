import { Paper } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Flight from "./IndividualFlight";
import FlightCosts from "./FlightCosts";
import { OneWayFlightSummary } from "../types/Flights";
import styled from "@emotion/styled";
import { useState } from "react";

interface OneWayFlightProps extends OneWayFlightSummary {
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

export default function OneWayFlight(props: OneWayFlightProps) {
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
      <Grid container spacing={1}>
        <Grid size="grow" container>
          <Flight
            departureName={props.forwardFlight.departureAirport.name}
            departureTime={new Date(Date.parse(props.forwardFlight.initialDeparture))}
            departureCode={props.forwardFlight.departureAirport.code}
            arrivalName={props.forwardFlight.arrivalAirport.name}
            arrivalTime={new Date(Date.parse(props.forwardFlight.finalArrival))}
            arrivalCode={props.forwardFlight.arrivalAirport.code}
            totalDuration={props.forwardFlight.totalTime}
            stops={props.forwardFlight.stops}
            airlineName={props.forwardFlight.airline.name}
            airlineCode={props.forwardFlight.airline.code}
          />
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
