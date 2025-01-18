// Importing the Transaction type to ensure correct type-checking for the input data
import { Transaction } from "@/types/Transaction";

// Defining the structure for the processTransactionYear object, where each year maps to months
interface processTransactionYear {
    [key: number]: processTransactionMonth; // Year mapped to months
}

// Defining the structure for the processTransactionMonth object, where each month maps to days
interface processTransactionMonth {
    [key: string]: processTransactionDay; // Month name mapped to days
}

// Structure of data for each day, including the income, expense, and balance for that day
interface processTransactionData {
    day: number;                 // The day of the transaction
    month: string;               // The month name
    year: number;                // The year of the transaction
    income: number[];            // Array of income amounts for the day
    expense: number[];           // Array of expense amounts for the day
    balance: number[];           // Array of balance values for the day
}

// Defining the structure for the processTransactionDay object, where each day maps to its data
interface processTransactionDay {
    [key: number]: processTransactionData; // Day mapped to transaction data
}

// Main function that processes an array of transactions and groups them by year, month, and day
export default function ProcessTransactionData(transactionArray: Transaction[]): processTransactionYear {
    const returnObject: processTransactionYear = {};  // Initializing the return object for structured data

    // Looping through each transaction in the transaction array
    transactionArray.forEach(transaction => {
        const transactionDate = new Date(transaction.date_time); // Creating a Date object from the transaction's date_time
        const year = transactionDate.getFullYear();  // Extracting the year from the date
        const month = transactionDate.toLocaleString('default', { month: 'long' }); // Extracting the month as a string (e.g., "January")
        const day = transactionDate.getDate(); // Extracting the day of the month

        const amount = parseFloat(transaction.amount);  // Converting the transaction amount to a float
        const balance = parseFloat(transaction.balance);  // Converting the transaction balance to a float

        const isCredit = transaction.transaction_type === 'credit' ? true : false; // Checking if the transaction is a credit

        // Ensuring the year exists in the returnObject
        if (!returnObject[year]) {
            returnObject[year] = {};  // If not, initialize it as an empty object
        }

        // Ensuring the month exists for the specific year
        if (!returnObject[year][month]) {
            returnObject[year][month] = {};  // If not, initialize it as an empty object
        }

        // Ensuring the day exists for the specific month and year
        if (!returnObject[year][month][day]) {
            returnObject[year][month][day] = {
                day,    // Adding the day
                month,  // Adding the month
                year,   // Adding the year
                income: [],   // Initializing the income array for the day
                expense: [],  // Initializing the expense array for the day
                balance: [],  // Initializing the balance array for the day
            };
        }

        // Adding the transaction data to the appropriate day
        if (isCredit) {
            returnObject[year][month][day].income.push(amount);  // If credit, add to income
        } else {
            returnObject[year][month][day].expense.push(amount);  // If debit, add to expense
        }

        // Adding the balance for the day
        returnObject[year][month][day].balance.push(balance);
    });

    return returnObject;  // Return the structured data organized by year, month, and day
}
