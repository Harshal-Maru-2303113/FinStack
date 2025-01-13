

import { Transaction } from "@/types/Transaction";


interface processTransactionYear {
    [key: number]: processTransactionMonth;
}

interface processTransactionMonth {
    [key: string]: processTransactionDay;
}

interface processTransactionData {
    day: number;
    month: string;
    year: number;
    income: number[];
    expense:number[];
    balance: number[];
}

interface processTransactionDay {
    [key: number]: processTransactionData;
}

export default function ProcessTransactionData(transactionArray: Transaction[]): processTransactionYear {
    const returnObject: processTransactionYear = {};

    transactionArray.forEach(transaction => {
        const transactionDate = new Date(transaction.date_time);
        const year = transactionDate.getFullYear();
        const month = transactionDate.toLocaleString('default', { month: 'long' }); // e.g., "January"
        const day = transactionDate.getDate();

        const amount = parseFloat(transaction.amount);
        const balance = parseFloat(transaction.balance);

        const isCredit = transaction.transaction_type === 'credit' ? true : false;

        // Ensure the year exists in returnObject
        if (!returnObject[year]) {
            returnObject[year] = {};
        }

        // Ensure the month exists in the year
        if (!returnObject[year][month]) {
            returnObject[year][month] = {};
        }

        // Ensure the day exists in the month
        if (!returnObject[year][month][day]) {
            returnObject[year][month][day] = {
                day,
                month,
                year,
                income: [],
                expense:[],
                balance: [],
            };
        }

        // Add the transaction details
        if(isCredit){
            returnObject[year][month][day].income.push(amount);
        }
        else{
            returnObject[year][month][day].expense.push(amount);
        }
        returnObject[year][month][day].balance.push(balance);
    });

    return returnObject;
}