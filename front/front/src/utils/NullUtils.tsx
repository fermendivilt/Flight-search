const IsNull = (value: any) => {
    return value === null;
}

//I hate that ','; stackoverflow says nothing we can do 
const NotNullString = (value: string | null): string => {
    if(value === null) return "";

    return value;
}
const NotNullBoolean = (value: boolean | null): boolean => {
    if(value === null) return false;
        
    return value;
}
const NotNullNumber = (value: number | null): number => {
    if(value === null) return 0;

    return value;
}

export { IsNull, NotNullString, NotNullBoolean, NotNullNumber }