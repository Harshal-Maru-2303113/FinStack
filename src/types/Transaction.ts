
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
  

export type { Transaction };