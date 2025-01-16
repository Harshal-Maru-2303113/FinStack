
type budgetData = {
    email: string;
    category_id: number; // Ensure it's a number if Prisma expects this type
    budget_amount: number;
    amount_spent: number;
    valid_until: Date; // Must be a JavaScript Date object
  };
  
type BudgetFetchData = {
  budget_id: number;
  email: string;
  category_id: number;
  budget_amount: number;
  amount_spent: number;
  created_at: Date;
  updated_at: Date;
  valid_until: Date;
  emailSent50: boolean;
  emailSent100: boolean;
};


export type {budgetData,BudgetFetchData};