import { Paper } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Flight from "./IndividualFlight";
import FlightCosts from "./FlightCosts";

export default function OneWayFlight() {
  return (
    <Paper elevation={5} sx={{ padding: 3 }}>
      <Grid container spacing={1}>
        <Grid size="grow" container>
          <Flight />
        </Grid>
        <Grid
          size="auto"
          container
          sx={{ alignItems: "center", justifyContent: "center" }}
        >
          <FlightCosts />
        </Grid>
      </Grid>
    </Paper>
  );
}
