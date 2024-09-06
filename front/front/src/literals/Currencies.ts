type Currencies = "USD" | "MXN" | "EUR" ;

const StringToValidCurrency = (value: string): Currencies => {
    if(value == "USD" || value == "MXN" || value == "EUR")
        return <Currencies>value;

    return "USD";
}

export type { Currencies };
export { StringToValidCurrency }