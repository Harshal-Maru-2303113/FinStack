// Interface representing a single transaction record
interface Transaction {
  transaction_id: number; // Unique identifier for the transaction
  email: string; // The email associated with the transaction
  date_time: Date; // The date and time when the transaction occurred
  amount: string; // The amount involved in the transaction, represented as a string
  transaction_type: string; // The type of transaction, such as "credit" or "debit"
  description: string; // A description or note about the transaction
  balance: string; // The account balance after the transaction, represented as a string
  category_id: number; // The ID of the category associated with the transaction
  category_name: string; // The name of the category associated with the transaction
}

// Exporting the interface for use in other parts of the application
export type { Transaction };
