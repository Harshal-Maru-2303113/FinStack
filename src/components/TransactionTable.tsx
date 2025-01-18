import { motion } from "framer-motion";
import { FiCalendar } from "react-icons/fi";
import { Transaction } from "@/types/Transaction";
import TransactionLoading from "@/components/TransactionLoading";
import truncateDescription from "@/utils/truncateDescription";

interface TransactionTableProps {
  transactions: Transaction[]; // Array of transactions to display in the table
  isLoading: boolean; // Loading state to show loading indicators
  onRowClick: (transaction: Transaction) => void; // Function to handle row click event
}

export default function TransactionTable({
  transactions,
  isLoading,
  onRowClick,
}: TransactionTableProps) {

  return (
    <div className="overflow-x-auto">
      <table className="w-full overflow-hidden">
        <thead>
          <tr className="text-gray-400 border-b border-gray-800">
            {/* Table header for each column */}
            <th className="py-4 px-4 text-left text-xl">Sr</th>
            <th className="py-4 px-4 text-left text-xl">Date</th>
            <th className="py-4 px-4 text-left text-xl">Name</th>
            <th className="py-4 px-4 text-left text-xl">Category</th>
            <th className="py-4 px-4 text-right text-xl">Amount</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            // Show loading placeholders when data is being fetched
            <tr>
              <td>
                <TransactionLoading items={4} />
              </td>
              <td>
                <TransactionLoading items={4} />
              </td>
              <td>
                <TransactionLoading items={4} />
              </td>
              <td>
                <TransactionLoading items={4} />
              </td>
              <td>
                <TransactionLoading items={4} />
              </td>
            </tr>
          ) : (
            // Render each transaction when data is available
            transactions.map((transaction, index) => (
              <motion.tr
                key={transaction.transaction_id}
                initial={{ opacity: 0, y: 20 }} // Initial animation state for each row
                animate={{ opacity: 1, y: 0 }} // Final animation state for each row
                transition={{ delay: index * 0.1 }} // Delay each row's animation
                className="border-b border-gray-800 hover:bg-gray-800/50 transition-all"
                onClick={() => onRowClick(transaction)} // Handle row click event
              >
                <td className="py-4 px-4 text-gray-300">{index + 1}</td>
                <td className="py-4 px-4 text-gray-300">
                  {/* Display date with calendar icon */}
                  <FiCalendar className="inline mr-2" />
                  {new Date(transaction.date_time).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="py-4 px-4 text-white">
                  {/* Truncate the description if it's too long */}
                  {truncateDescription(transaction.description)}
                </td>
                <td className="py-4 px-4 text-gray-300">
                  {transaction.category_name} {/* Display transaction category */}
                </td>
                <td
                  className={`py-4 px-4 text-right font-semibold ${
                    transaction.transaction_type === "credit"
                      ? "text-green-500" // Credit transactions are green
                      : "text-red-500" // Debit transactions are red
                  }`}
                >
                  {transaction.transaction_type === "credit" ? "+" : "-"}
                  {/* Display amount with appropriate sign */}
                  {transaction.amount}
                </td>
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
