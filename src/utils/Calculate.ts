
interface Transaction {
    transaction_id: number;
    email: string;
    date_time: Date;
    amount: string;
    transaction_type: string;
    description: string;
    balance: string;
    category_id: number;
    category_name: string;
  }
  

  const calculateBalance = (transactions: Transaction[]) => {
    let totalIncome = 0;
    let totalSpending = 0;
    let currentBalance = 0;
  
    transactions.forEach((transaction) => {
      if (transaction.transaction_type === 'credit') {
        totalIncome += Number(transaction.amount);
      } else if (transaction.transaction_type === 'debit') {
        totalSpending += Number(transaction.amount);
      }
    });

    currentBalance = totalIncome - totalSpending;
  
    return {
      currentBalance,
      totalIncome,
      totalSpending,
    };
  };
  export type { Transaction };
 export {calculateBalance};