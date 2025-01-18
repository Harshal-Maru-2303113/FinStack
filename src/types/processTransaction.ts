// Represents a collection of transactions for each year
interface processTransactionYear {
    // The key is a number representing the year (e.g., 2025),
    // and the value is an object containing data for each month of that year.
    [key: number]: processTransactionMonth;
  }
  
  // Represents a collection of transactions for each month
  interface processTransactionMonth {
    // The key is a string representing the month (e.g., "January", "February"),
    // and the value is an object containing data for each day in that month.
    [key: string]: processTransactionDay;
  }
  
  // Represents a single transaction entry for a specific day
  interface processTransactionData {
    day: number; // The day of the month (1-31)
    month: string; // The name of the month (e.g., "January")
    year: number; // The year of the transaction
    income: number[]; // An array of income amounts for that day
    expense: number[]; // An array of expense amounts for that day
    balance: number[]; // An array of balance values for that day
  }
  
  // Represents a collection of transactions for each day of the month
  interface processTransactionDay {
    // The key is a number representing the day (e.g., 1, 2, 3, ...),
    // and the value is the transaction data for that specific day.
    [key: number]: processTransactionData;
  }
  
  // Exporting the interfaces for use in other parts of the application
  export type {
    processTransactionYear, 
    processTransactionDay, 
    processTransactionData, 
    processTransactionMonth
  };
  