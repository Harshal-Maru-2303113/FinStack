import {
  processTransactionMonth,
  processTransactionYear,
} from "@/types/processTransaction";

// Function to aggregate transaction data, normalizing daily data and performing aggregation by year or month
export async function AggregateTransactionData(data: processTransactionYear) {
  // Return an empty object if the input data is empty
  if (Object.keys(data).length === 0) {
    return {};
  }

  const yearKeys = Object.keys(data); // Get all the years present in the data

  // Normalize each day's data by calculating averages for income, expense, and balance
  for (const year of yearKeys) {
    const months = data[Number(year)]; // Get all months for the current year
    for (const month in months) {
      const days = months[month]; // Get all days in the current month
      for (const day in days) {
        const dayInfo = days[day]; // Access data for the current day

        // Calculate the average income, expense, and balance for each day
        dayInfo.income = [
          dayInfo.income.reduce((a: number, b: number) => a + b, 0) /
            dayInfo.income.length || 0, // Sum of income divided by the number of entries, default to 0 if empty
        ];
        dayInfo.expense = [
          dayInfo.expense.reduce((a: number, b: number) => a + b, 0) /
            dayInfo.expense.length || 0, // Sum of expenses divided by the number of entries, default to 0 if empty
        ];
        dayInfo.balance = [
          dayInfo.balance.reduce((a: number, b: number) => a + b, 0) /
            dayInfo.balance.length || 0, // Sum of balance divided by the number of entries, default to 0 if empty
        ];
      }
    }
  }

  // Aggregate data across multiple years if more than one year is present
  if (yearKeys.length > 1) {
    const aggregatedYears: processTransactionYear = {}; // Object to store aggregated data by year

    yearKeys.forEach((year) => {
      const monthData = data[Number(year)];
      let totalIncome = 0,
        totalExpense = 0,
        totalBalance = 0;

      // Loop through months and days to accumulate total income, expense, and balance for the year
      for (const month in monthData) {
        for (const day in monthData[month]) {
          const dayInfo = monthData[month][day];
          totalIncome += dayInfo.income[0]; // Add daily income to the total
          totalExpense += dayInfo.expense[0]; // Add daily expense to the total
          totalBalance += dayInfo.balance[0]; // Add daily balance to the total
        }
      }

      // Store the aggregated values for the year
      aggregatedYears[Number(year)] = {
        Aggregated: {
          1: {
            day: 0, // Placeholder for day (as it's aggregated data)
            month: "Aggregated", // Label for the aggregated month
            year: parseInt(year), // Current year
            income: [totalIncome || 0], // Store aggregated income, default to 0 if no data
            expense: [totalExpense || 0], // Store aggregated expense, default to 0 if no data
            balance: [totalBalance || 0], // Store aggregated balance, default to 0 if no data
          },
        },
      };
    });

    return aggregatedYears; // Return the aggregated data by year
  }

  // If there's only one year, check if there are multiple months to aggregate
  const year = yearKeys[0]; // Get the only year present
  const monthKeys = Object.keys(data[Number(year)]); // Get all months for this year

  // Aggregate data if there are multiple months in the year
  if (monthKeys.length > 1) {
    const aggregatedMonths: processTransactionMonth = {}; // Object to store aggregated data by month

    monthKeys.forEach((month) => {
      const dayData = data[Number(year)][month]; // Get the data for the current month
      let totalIncome = 0,
        totalExpense = 0,
        totalBalance = 0;

      // Loop through days in the month to accumulate total income, expense, and balance
      for (const day in dayData) {
        const dayInfo = dayData[day];
        totalIncome += dayInfo.income[0]; // Add daily income to the total
        totalExpense += dayInfo.expense[0]; // Add daily expense to the total
        totalBalance += dayInfo.balance[0]; // Add daily balance to the total
      }

      // Store the aggregated values for the month
      aggregatedMonths[month] = {
        1: {
          day: 0, // Placeholder for day (as it's aggregated data)
          month: "", // Placeholder for month (since it's aggregated)
          year: Number(year), // Current year
          income: [totalIncome || 0], // Store aggregated income, default to 0 if no data
          expense: [totalExpense || 0], // Store aggregated expense, default to 0 if no data
          balance: [totalBalance || 0], // Store aggregated balance, default to 0 if no data
        },
      };
    });

    return { [year]: aggregatedMonths }; // Return the aggregated data by month for the year
  }

  // If there's only one year and one month, return the normalized data without further aggregation
  return data; // Return the data as is without further aggregation
}
