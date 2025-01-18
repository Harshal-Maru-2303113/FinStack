// Importing the Category interface to ensure type safety for the category objects
import Category from "@/types/Categories";
  
// Defining an array of category objects, each containing a unique category_id and its name
const categories: Category[] = [
  { category_id: 7, name: "Communication" },         // Category for communication-related expenses
  { category_id: 9, name: "Financial Expenses" },    // Category for financial expense-related transactions
  { category_id: 1, name: "Food" },                  // Category for food-related expenses
  { category_id: 3, name: "Housing" },               // Category for housing-related expenses
  { category_id: 8, name: "Internet & Social Media" }, // Category for internet and social media expenses
  { category_id: 10, name: "Investments" },           // Category for investment-related transactions
  { category_id: 6, name: "Life & Entertainment" },  // Category for life and entertainment expenses
  { category_id: 11, name: "Others" },               // A catch-all category for miscellaneous expenses
  { category_id: 2, name: "Shopping" },              // Category for shopping-related transactions
  { category_id: 4, name: "Transportation" },        // Category for transportation expenses
  { category_id: 5, name: "Vehicle" },               // Category for vehicle-related expenses
  { category_id: 12, name: "Income" },               // Category for income transactions
];

// Exporting the categories array to be used in other parts of the application
export { categories };
