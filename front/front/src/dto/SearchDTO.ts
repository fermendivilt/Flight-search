import { TodayDate } from "../utils/StringToDate";
import { StringToValidCurrency } from "../literals/Currencies";

type SearchDTO = {
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
  returnDate: string;
  adults: number;
  currency: string;
  nonStop: boolean;
};

const EmptySearchDTO = (): SearchDTO => {
  return {
    departureAirport: "",
    arrivalAirport: "",
    departureDate: TodayDate(),
    returnDate: TodayDate(),
    adults: 1,
    currency: "",
    nonStop: false,
  };
};

type SearchDTOValidation = {
  hasError: boolean;
  departureAirportError: string;
  arrivalAirportError: string;
  departureDateError: string;
  arrivalDateError: string;
  adultsError: string;
  currencyError: string;
};

const ValidateSearchDTO = (dto: SearchDTO): SearchDTOValidation => {
  const result = {
    departureAirportError: validateDepartureAirport(dto),
    arrivalAirportError: validateArrivalAirport(dto),
    departureDateError: validateDepartureDate(dto),
    arrivalDateError: validateArrivalDate(dto),
    adultsError: validateAdults(dto),
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
  const present = new Date(TodayDate());

  if (date < present) return "Date cannot be in the past";

  return "";
};
const validateArrivalDate = (dto: SearchDTO): string => {
  const required = requiredValidation(dto.returnDate);
  if (required.length > 0) return required;

  const date = new Date(dto.returnDate);
  const departure = new Date(dto.departureDate);
  if (
    date.getFullYear() < departure.getFullYear() ||
    date.getMonth() < departure.getMonth() ||
    date.getDay() < departure.getDay()
  )
    return "Arrival cannot be before departure";

  return "";
};
const validateAdults = (dto: SearchDTO): string => {
  const required = requiredValidation(dto.adults.toString());
  if (required.length > 0) return required;

  if (Number.isNaN(dto.adults)) return "Must be a number";

  if (dto.adults < 1) return "Must be a valid number";

  return "";
};
const validateCurrency = (dto: SearchDTO): string => {
  if (StringToValidCurrency(dto.currency) === null)
    return "Not a valid currency";

  return "";
};
const requiredValidation = (value: string): string => {
  if (!value.trim().length) return "Required";

  return "";
};

export type { SearchDTO, SearchDTOValidation };
export { EmptySearchDTO, ValidateSearchDTO };
