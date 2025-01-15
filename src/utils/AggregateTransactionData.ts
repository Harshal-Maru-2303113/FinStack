import {
  processTransactionMonth,
  processTransactionYear,
} from "@/types/processTransaction";

export async function AggregateTransactionData(data: processTransactionYear) {
  // Return an empty object if the input is empty
  if (Object.keys(data).length === 0) {
    return {};
  }

  const yearKeys = Object.keys(data);

  // Normalize each day's data by calculating averages for income, expense, and balance
  for (const year of yearKeys) {
    const months = data[Number(year)];
    for (const month in months) {
      const days = months[month];
      for (const day in days) {
        const dayInfo = days[day];
        dayInfo.income = [
          dayInfo.income.reduce((a: number, b: number) => a + b, 0) /
            dayInfo.income.length || 0,
        ];
        dayInfo.expense = [
          dayInfo.expense.reduce((a: number, b: number) => a + b, 0) /
            dayInfo.expense.length || 0,
        ];
        dayInfo.balance = [
          dayInfo.balance.reduce((a: number, b: number) => a + b, 0) /
            dayInfo.balance.length || 0,
        ];
      }
    }
  }

  // Aggregate only if there are multiple years
  if (yearKeys.length > 1) {
    const aggregatedYears: processTransactionYear = {};

    yearKeys.forEach((year) => {
      const monthData = data[Number(year)];
      let totalIncome = 0,
        totalExpense = 0,
        totalBalance = 0

      for (const month in monthData) {
        for (const day in monthData[month]) {
          const dayInfo = monthData[month][day];
          totalIncome += dayInfo.income[0];
          totalExpense += dayInfo.expense[0];
          totalBalance += dayInfo.balance[0];
        }
      }

      aggregatedYears[Number(year)] = {
        Aggregated: {
          1: {
            day: 0, // Placeholder
            month: "Aggregated",
            year: parseInt(year),
            income: [totalIncome  || 0],
            expense: [totalExpense || 0],
            balance: [totalBalance || 0],
          },
        },
      };
    });

    return aggregatedYears;
  }

  // If there's only one year, check for multiple months
  const year = yearKeys[0];
  const monthKeys = Object.keys(data[Number(year)]);

  // Aggregate only if there are multiple months
  if (monthKeys.length > 1) {
    const aggregatedMonths: processTransactionMonth = {};

    monthKeys.forEach((month) => {
      const dayData = data[Number(year)][month];
      let totalIncome = 0,
        totalExpense = 0,
        totalBalance = 0

      for (const day in dayData) {
        const dayInfo = dayData[day];
        totalIncome += dayInfo.income[0];
        totalExpense += dayInfo.expense[0];
        totalBalance += dayInfo.balance[0];
      }

      aggregatedMonths[month] = {
        1: {
          day: 0, // Placeholder
          month: "",
          year: Number(year),
          income: [totalIncome  || 0],
          expense: [totalExpense  || 0],
          balance: [totalBalance || 0],
        },
      };
    });

    return { [year]: aggregatedMonths };
  }

  // If there's only one year and one month, return the normalized data without aggregation
  return data;
}
