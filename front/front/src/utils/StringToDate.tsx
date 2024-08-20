function TodayDate(): string {
  return new Date(Date.now())
    .toISOString() // Standard time format
    .substring(0, 10); // Chars that represent date, for example: 2002-03-19
}

export { TodayDate };