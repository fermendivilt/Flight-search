const DateTo12H = (time: Date): string => {
  return time.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

//PnDTnHnM : n = /\d+/g;
const DurationTo12H = (duration: string): string => {
  const regex = /\d+/g;
  const result = "";
  let index = 0;

  const durations = duration.match(regex);

  if (durations === null) return "";

  if (durations.length === 3) {
    result.concat(durations[index] + " day(s), ");
    index += 1;
  }

  result.concat(durations[index] + "h " + durations[index + 1] + "m");

  return result;
};

export { DateTo12H, DurationTo12H };
