export default function processTransactionDates(
  transactions: { date_time: string | Date }[]
): { xAxis: { title: string; labels: string[] } } {
  const labels: string[] = [];
  const uniqueMonths = new Set<string>();
  const uniqueYears = new Set<number>();

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date_time);
    const month = date.toLocaleString("default", { month: "long" }); // Full month name (e.g., "January")
    const year = date.getFullYear();
    uniqueMonths.add(month);
    uniqueYears.add(year);
  });

  let xAxisTitle = "";

  if (uniqueYears.size === 1) {
    // Only one year is present
    xAxisTitle = Array.from(uniqueYears)[0].toString(); // Year as title
    if (uniqueMonths.size === 1) {
      // Only one month is present
      transactions.forEach((transaction) => {
        const date = new Date(transaction.date_time);
        labels.push(date.getDate().toString()); // Dates (e.g., "1", "2")
      });
    } else {
      // Multiple months are present
      transactions.forEach((transaction) => {
        const date = new Date(transaction.date_time);
        const month = date.toLocaleString("default", { month: "long" });
        labels.push(month); // Months (e.g., "January", "February")
      });
    }
  } else {
    // Multiple years are present
    xAxisTitle = "Years";
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date_time);
      labels.push(date.toLocaleDateString()); // Full dates (e.g., "MM/DD/YYYY")
    });
  }

  return {
    xAxis: {
      title: xAxisTitle,
      labels,
    },
  };
}
