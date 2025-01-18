// Type definition for a new budget entry
type budgetData = {
  email: string; // User's email address
  category_id: number; // ID of the category to which the budget belongs (ensure it's a number if using Prisma)
  budget_amount: number; // Total allocated budget amount for this category
  amount_spent: number; // Amount spent from the allocated budget
  valid_until: Date; // Date until which the budget is valid (must be a JavaScript Date object)
};

// Type definition for data returned from the budget fetch (e.g., from the database)
type BudgetFetchData = {
  budget_id: number; // Unique ID for the budget entry
  email: string; // User's email address
  category_id: number; // ID of the category associated with this budget
  budget_amount: number; // Total allocated budget amount for this category
  amount_spent: number; // Amount already spent from the budget
  created_at: Date; // Timestamp when the budget was created
  updated_at: Date; // Timestamp when the budget was last updated
  valid_until: Date; // Date until which the budget is valid
  emailSent50: boolean; // Indicates if the user has been notified when spending reached 50% of the budget
  emailSent100: boolean; // Indicates if the user has been notified when spending reached 100% of the budget
};

// Exporting both types for use in other parts of the application
export type { budgetData, BudgetFetchData };
