export const getTotalSpent = (data: ExpenseChartList) => {
  return data.reduce((sum, expense) => sum + expense.amount, 0);
};

export const downloadUrl = async (downloadUrl: string, fileName: string) => {
  const blob = await fetch(downloadUrl).then((res) => res.blob());
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(objectUrl);
};
