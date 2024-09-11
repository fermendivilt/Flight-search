const DateTo12H = (time: Date): string => {
  return time.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

//PnDTnHnM : n = /\d+/g;
const DurationTo12H = (duration: string): [number, string] => {
  const regex = /\d+/g;
  let result = "", timeInMinutes = 0;
  let index = 0;

  const durations = duration.match(regex);

  if (durations === null) return [0, ""];

  if (durations.length === 3) {
    result = result.concat(durations[index] + " day(s), ");
    timeInMinutes += parseInt(durations[index]) * 24 * 60;
    index += 1;
  }

  result = result.concat(
    (durations[index] !== undefined ? durations[index] + "h " : "") +
      (durations[index + 1] !== undefined ? durations[index + 1] + "m" : "")
  );

  timeInMinutes += parseInt(durations[index]) * 60 + parseInt(durations[index + 1]);

  return [timeInMinutes, result];
};

export { DateTo12H, DurationTo12H };
