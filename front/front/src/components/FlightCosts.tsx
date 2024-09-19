import { Stack, Typography } from "@mui/material";
import { StringToValidCurrency } from "../literals/Currencies";
import NumberToCurrency from "../utils/NumberToCurrency";

interface FlightCostsProps {
  currency: string;
  totalPrice: string;
  pricePerTraveler: string;
}

export default function FlightCosts({
    currency,
    totalPrice,
    pricePerTraveler
}: FlightCostsProps) {
  return (
    <Stack spacing={1} sx={{ marginX: 4 }}>
      <Stack sx={{ alignItems: "flex-end" }}>
        <Typography variant="body1">
          {NumberToCurrency(StringToValidCurrency(currency) ?? "USD", parseFloat(totalPrice))}
        </Typography>
        <Typography variant="body2">Total</Typography>
      </Stack>
      <Stack sx={{ alignItems: "flex-end" }}>
        <Typography variant="body1">
          {NumberToCurrency(StringToValidCurrency(currency) ?? "USD", parseFloat(pricePerTraveler))}
        </Typography>
        <Typography variant="body2">Per traveler</Typography>
      </Stack>
    </Stack>
  );
}
