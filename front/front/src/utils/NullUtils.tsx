const IsNull = (value: any) => {
  return value === null;
};

//I hate that ','; stackoverflow says nothing we can do
const NotNullString = <T,>(value: T | null): string => {
  if (IsNull(value)) return "";

  return String(value);
};
const NotNullBoolean = <T,>(value: T | null): boolean => {
  if (IsNull(value)) return false;

  return Boolean(value);
};
const NotNullNumber = <T,>(value: T | null): number => {
  if (IsNull(value)) return 0;

  return Number(value);
};

export { IsNull, NotNullString, NotNullBoolean, NotNullNumber };
