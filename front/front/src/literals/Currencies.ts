type Currencies = "USD" | "MXN" | "EUR" ;

const StringToValidCurrency = (value: string): Currencies | null => {
    if(value == "USD" || value == "MXN" || value == "EUR")
        return <Currencies>value;

    return null;
}

export type { Currencies };
export { StringToValidCurrency }