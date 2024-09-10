import { Paper } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Flight from "./IndividualFlight";
import FlightCosts from "./FlightCosts";
import { FlightSummary } from "../types/Flights";
import styled from "@emotion/styled";
import { useState } from "react";

interface OneWayFlightProps extends FlightSummary {
  currency: string;
}

const StyledPaper = styled(Paper)({
  position: "relative",
  overflow: "hidden",
  padding: 3,
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
      onMouseEnter={() => setHover(true)}
      onClick={props.onClick}
    >
      <BrightnessOverlay
        style={hover ? { animation: "wave 0.1s forwards" } : {}}
      />
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
    </StyledPaper>
  );
}
