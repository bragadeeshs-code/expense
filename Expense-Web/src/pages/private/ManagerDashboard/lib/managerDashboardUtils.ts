export const transformSpendingOverview = (
  combinedSpendingOverviewData: Record<string, string> | undefined,
) => {
  return Object.entries(combinedSpendingOverviewData ?? {}).map(
    ([day, expense]) => ({
      day: new Date(day),
      expense: Number(expense),
    }),
  );
};
