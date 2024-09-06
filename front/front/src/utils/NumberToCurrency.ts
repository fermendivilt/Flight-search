import { Currencies } from "../literals/Currencies";

const toMXN = (amount: number) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount);
};

const toUSD = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const toEUR = (amount: number) => {
  return new Intl.NumberFormat(navigator.language, {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

const NumberToCurrency = (currency: Currencies, amount: number) => {
  switch (currency) {
    case "MXN":
      return toMXN(amount);

    case "EUR":
      return toEUR(amount);
      
    case "USD":
    default:
      return toUSD(amount);
  }
};

export default NumberToCurrency;
