import { Stack, Typography } from "@mui/material";
import { StringToValidCurrency } from "../literals/Currencies";
import NumberToCurrency from "../utils/NumberToCurrency";

export default function FlightCosts() {
  return (
    <Stack spacing={1} sx={{ marginX: 4 }}>
      <Stack sx={{ alignItems: "flex-end" }}>
        <Typography variant="body1">
          {NumberToCurrency(StringToValidCurrency("USD"), 1500)}
        </Typography>
        <Typography variant="body2">Total</Typography>
      </Stack>
      <Stack sx={{ alignItems: "flex-end" }}>
        <Typography variant="body1">
          {NumberToCurrency(StringToValidCurrency("USD"), 500)}
        </Typography>
        <Typography variant="body2">Per traveler</Typography>
      </Stack>
    </Stack>
  );
}
