import { Typography, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";

export default function Flight() {
    return (
      <>
        <Grid size={12}>
          <Typography variant="body1">1:40pm - 4:39am</Typography>
        </Grid>
        <Grid container size={12}>
          <Grid size={6}>
            <Typography variant="body1">
              San Francisco (SFO) - New York (JFK)
            </Typography>{" "}
          </Grid>
          <Grid size={6}>
            <Stack>
              <Typography variant="body1">8h 17m (1 stop)</Typography>
              <Typography variant="body1">1h 3m in Los Angeles (LAX)</Typography>
              <Typography variant="body1">1h 3m in Los Angeles (LAX)</Typography>
            </Stack>
          </Grid>
        </Grid>
        <Grid size={12}>
          <Typography variant="body1">Aeromexico (AM)</Typography>
        </Grid>
      </>
    );
  }