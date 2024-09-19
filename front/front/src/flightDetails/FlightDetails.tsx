import { Typography, Stack, Paper, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Dictionaries, FlightOffer, Segment } from "../dto/SearchResponseDTO";
import NumberToCurrency from "../utils/NumberToCurrency";
import { Currencies } from "../literals/Currencies";
import { ArrowBackIosNew } from "@mui/icons-material";

interface FlightDetailsProps {
  flights: FlightOffer;
  dictionary: Dictionaries;
  backToResults: () => void;
}

export default function FlightDetails({
  flights,
  dictionary,
  backToResults,
}: FlightDetailsProps) {
  return (
    <Grid container spacing={1} sx={{ height: "100vh", paddingY: 2 }}>
      <Grid
        size={12}
        sx={{ display: "flex", alignItems: "center", paddingY: 1 }}
      >
        <Paper sx={{ width: "100%", alignItems: "center", paddingY: 1, paddingX: 2 }}>
          <Button variant="outlined" onClick={backToResults}>
            <ArrowBackIosNew /> Return to results
          </Button>
        </Paper>
      </Grid>
      <Grid
        size={7}
        sx={{ maxHeight: "80vh", display: "block", overflowY: "auto" }}
      >
        {flights.itineraries.map((itinerary, index) => {
          return itinerary.segments.map((segment, subIndex) => (
            <Paper
              key={parseInt("" + index + subIndex)}
              elevation={5}
              sx={{ padding: 3, marginBottom: 4 }}
            >
              <Grid container spacing={1}>
                <Grid size={8}>
                  <Grid size={12}>
                    <Typography gutterBottom variant="body1">
                      {flights.itineraries.length > 1
                        ? index === 0
                          ? "Forward s"
                          : "Return s"
                        : "S"}
                      egment {subIndex + 1}
                    </Typography>
                  </Grid>
                  <Grid size={12}>
                    <Typography gutterBottom variant="body1">
                      {formatCompleteDate(segment.departure.at)} -{" "}
                      {formatCompleteDate(segment.arrival.at)}
                    </Typography>
                  </Grid>
                  <Grid size={12}>
                    <Typography gutterBottom variant="body1">
                      {
                        dictionary.locations[segment.departure.iataCode]
                          .cityCode
                      }{" "}
                      ({segment.departure.iataCode}) -{" "}
                      {dictionary.locations[segment.arrival.iataCode].cityCode}{" "}
                      ({segment.arrival.iataCode})
                    </Typography>
                  </Grid>
                  <Grid size={12}>
                    <Typography gutterBottom variant="body1">
                      {dictionary.carriers[segment.carrierCode]} (
                      {segment.carrierCode})
                    </Typography>
                  </Grid>
                  <Grid size={12}>
                    <Typography gutterBottom variant="body1">
                      Flight number: {segment.number}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid size={4}>
                  <Paper elevation={2} sx={{ padding: 1 }}>
                    <Stack>
                      <Typography gutterBottom variant="body1">
                        Travelers fare details
                      </Typography>

                      {getFareDetailsBySegment(flights, segment)}
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          ));
        })}
      </Grid>
      <Grid size={1} />
      <Grid
        size={4}
        sx={{ maxHeight: "80vh", display: "block", overflowY: "auto" }}
      >
        <Paper elevation={5} sx={{ padding: 3 }}>
          <Typography variant="body1">Price breakdown</Typography>
          <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
            <Typography variant="body1">Base</Typography>
            <Typography gutterBottom variant="body1">
              {NumberToCurrency(
                flights.price.currency as Currencies,
                parseFloat(flights.price.base)
              )}
            </Typography>
          </Stack>
          <Typography variant="body1">Fees</Typography>
          {getFeesFromPrice(flights)}
          <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
            <Typography variant="body1">Total</Typography>
            <Typography gutterBottom variant="body1">
              {NumberToCurrency(
                flights.price.currency as Currencies,
                parseFloat(flights.price.total)
              )}
            </Typography>
          </Stack>
          <Paper elevation={2} sx={{ padding: 1 }}>
            <Typography variant="body1">Per traveler</Typography>
            <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
              <Typography variant="body1">Base</Typography>
              <Typography gutterBottom variant="body1">
                {NumberToCurrency(
                  flights.price.currency as Currencies,
                  parseFloat(flights.travelerPricings[0].price.base)
                )}
              </Typography>
            </Stack>
            <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
              <Typography variant="body1">Total</Typography>
              <Typography gutterBottom variant="body1">
                {NumberToCurrency(
                  flights.price.currency as Currencies,
                  parseFloat(flights.travelerPricings[0].price.total)
                )}
              </Typography>
            </Stack>
          </Paper>
        </Paper>
      </Grid>
    </Grid>
  );
}

const getFareDetailsBySegment = (flights: FlightOffer, segment: Segment) => {
  const details = flights.travelerPricings[0].fareDetailsBySegment.find(
    (x) => segment.id === x.segmentId
  );

  if (details === undefined) return <></>;

  const amenitiesAvailable =
    details.amenities !== undefined && details.amenities.length > 0;

  return (
    <>
      <Typography variant="body1">Cabin: {details.cabin}</Typography>
      <Typography variant="body1" gutterBottom>
        Class: {details.clazz}
      </Typography>

      {amenitiesAvailable && (
        <>
          <Typography variant="body1">Amenities available:</Typography>

          {details.amenities.map((amenity, index) => (
            <Typography key={index} variant="body1">
              {amenity.amenityType}: {amenity.description},
              {amenity.isChargeable ? "" : " not"} chargeable
            </Typography>
          ))}
        </>
      )}
    </>
  );
};

const getFeesFromPrice = (flights: FlightOffer) => {
  if (flights.price.fees.every((x) => parseFloat(x.amount) == 0)) {
    return (
      <Typography gutterBottom variant="body2">
        No fees :D
      </Typography>
    );
  }

  flights.price.fees.map((fee, index) => {
    if (parseFloat(fee.amount) == 0) return;
    return (
      <Stack
        key={index}
        direction={"row"}
        sx={{ justifyContent: "space-between" }}
      >
        <Typography variant="body1">{fee.type}</Typography>
        <Typography gutterBottom variant="body1">
          {NumberToCurrency(
            flights.price.currency as Currencies,
            parseFloat(fee.amount)
          )}
        </Typography>
      </Stack>
    );
  });
};

const formatCompleteDate = (date: string) => {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
