export const formatCompactNumber = (value: number) => {
  return new Intl.NumberFormat("en-in", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};
