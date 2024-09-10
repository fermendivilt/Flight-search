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
  let result = "";
  let index = 0;

  const durations = duration.match(regex);

  if (durations === null) return "";

  if (durations.length === 3) {
    result = result.concat(durations[index] + " day(s), ");
    index += 1;
  }

  result = result.concat(
    (durations[index] !== undefined ? durations[index] + "h " : "") +
      (durations[index + 1] !== undefined ? durations[index + 1] + "m" : "")
  );

  console.log({ duration: duration, result: result });

  return result;
};

export { DateTo12H, DurationTo12H };
