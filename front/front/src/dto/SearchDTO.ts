type SearchDTO = {
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
  arrivalDate: string;
  currency: string;
  nonStop: boolean;
};

type SearchDTOValidation = {
  hasError: boolean;
  departureAirportError: string;
  arrivalAirportError: string;
  departureDateError: string;
  arrivalDateError: string;
  currencyError: string;
};

const ValidateSearchDTO = (dto: SearchDTO): SearchDTOValidation => {
  const result = {
    departureAirportError: validateDepartureAirport(dto),
    arrivalAirportError: validateArrivalAirport(dto),
    departureDateError: validateDepartureDate(dto),
    arrivalDateError: validateArrivalDate(dto),
    currencyError: validateCurrency(dto),
  };

  const errorFlag: string | undefined = Object.values(result).find(
    (element) => element.length > 0
  );

  return {
    hasError: errorFlag === undefined ? false : true,
    ...result,
  };
};

const validateDepartureAirport = (dto: SearchDTO): string =>
  requiredValidation(dto.departureAirport);
const validateArrivalAirport = (dto: SearchDTO): string => {
  const required = requiredValidation(dto.arrivalAirport);
  if (required.length > 0) return required;

  if (dto.arrivalAirport === dto.departureAirport)
    return "Arrival airport cannot be the same as departure";

  return "";
};
const validateDepartureDate = (dto: SearchDTO): string => {
  const required = requiredValidation(dto.departureDate);
  if (required.length > 0) return required;

  const date = new Date(dto.departureDate);
  const present = new Date(Date.now());
  if (
    date.getFullYear() < present.getFullYear() ||
    date.getMonth() < present.getMonth() ||
    date.getDay() < present.getDay()
  )
    return "Date cannot be in the past";

  return "";
};
const validateArrivalDate = (dto: SearchDTO): string => {
  const required = requiredValidation(dto.arrivalDate);
  if (required.length > 0) return required;

  const date = new Date(dto.arrivalDate);
  const departure = new Date(dto.departureDate);
  if (
    date.getFullYear() < departure.getFullYear() ||
    date.getMonth() < departure.getMonth() ||
    date.getDay() < departure.getDay()
  )
    return "Arrival cannot be before departure";

  return "";
};
const validateCurrency = (dto: SearchDTO): string => {
  if (!Currencies.includes(dto.currency)) return "Not a valid currency";

  return "";
};
const requiredValidation = (value: string): string => {
  if (!value.toString().trim().length) return "Required";

  return "";
};

const Currencies = ["USD", "MXN", "EUR"];

export type { SearchDTO, SearchDTOValidation }
export { ValidateSearchDTO, Currencies }