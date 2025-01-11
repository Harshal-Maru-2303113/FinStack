export default function processTransactionDates(
      transactions: { date_time: string | Date }[]
    ): string[] {
      const dates: string[] = [];
      const uniqueMonths = new Set<string>();

      transactions.forEach((transaction) => {
        const date = new Date(transaction.date_time);
        const month = date.toLocaleString("default", { month: "long" }); // Full month name (e.g., "January")
        uniqueMonths.add(month);
      });

      if (uniqueMonths.size > 1) {
        // If transactions span multiple months, return only the months
        transactions.forEach((transaction) => {
          const date = new Date(transaction.date_time);
          const month = date.toLocaleString("default", { month: "long" });
          dates.push(month);
        });
      } else {
        // If all transactions are in the same month, return full dates
        transactions.forEach((transaction) => {
          const date = new Date(transaction.date_time);
          dates.push(date.toLocaleDateString()); // Format: "MM/DD/YYYY"
        });
      }

      return dates;
    }