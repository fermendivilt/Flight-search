import { Paper, Typography, Divider } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Flight from "./IndividualFlight";
import FlightCosts from "./FlightCosts";

export default function TwoWayFlight() {
  return (
    <Paper elevation={5} sx={{ padding: 3 }}>
      <Grid container>
        <Grid size="grow" container>
          <Flight />

          <Grid size={12} sx={{ marginY: 2 }}>
            <Divider>
              <Typography variant="body2">Return</Typography>
            </Divider>
          </Grid>

          <Flight />
        </Grid>
        <Grid size="auto">
          <Divider orientation="vertical" />
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
