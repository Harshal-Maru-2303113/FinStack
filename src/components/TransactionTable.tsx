import { motion } from "framer-motion";
import { FiCalendar } from "react-icons/fi";
import { Transaction } from "@/types/Transaction";
import TransactionLoading from "@/components/TransactionLoading";
import truncateDescription from "@/utils/truncateDescription";

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  onRowClick: (transaction: Transaction) => void;
}

export default function TransactionTable({
  transactions,
  isLoading,
  onRowClick,
}: TransactionTableProps) {

  return (
    <div className="overflow-x-auto">
      <table className="w-full overflow-hidden ">
        <thead>
          <tr className="text-gray-400 border-b border-gray-800">
            <th className="py-4 px-4 text-left text-xl">Sr</th>
            <th className="py-4 px-4 text-left text-xl">Date</th>
            <th className="py-4 px-4 text-left text-xl">Name</th>
            <th className="py-4 px-4 text-left text-xl">Category</th>
            <th className="py-4 px-4 text-right text-xl">Amount</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
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
            transactions.map((transaction, index) => (
              <motion.tr
                key={transaction.transaction_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-gray-800 hover:bg-gray-800/50 transition-all"
                onClick={() => onRowClick(transaction)}
              >
                <td className="py-4 px-4 text-gray-300">{index + 1}</td>
                <td className="py-4 px-4 text-gray-300">
                  <FiCalendar className="inline mr-2" />
                  {new Date(transaction.date_time).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="py-4 px-4 text-white">
                  {truncateDescription(transaction.description)}
                </td>
                <td className="py-4 px-4 text-gray-300">
                  {transaction.category_name}
                </td>
                <td
                  className={`py-4 px-4 text-right font-semibold ${
                    transaction.transaction_type === "credit"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {transaction.transaction_type === "credit" ? "+" : "-"}
                  ${transaction.amount}
                </td>
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}