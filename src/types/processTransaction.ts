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
    income:number[];
    expense:number[];
    balance: number[];
}

interface processTransactionDay {
    [key: number]: processTransactionData;
}

export type {processTransactionYear,processTransactionDay,processTransactionData,processTransactionMonth};