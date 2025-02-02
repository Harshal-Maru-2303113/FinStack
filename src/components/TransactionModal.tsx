import { Transaction } from "@/types/Transaction";

interface TransactionModalProps {
  transaction: Transaction | null; // Transaction data, can be null when no transaction is selected
  onClose: () => void; // Function to close the modal
}

export default function TransactionModal({
  transaction,
  onClose,
}: TransactionModalProps) {
  if (!transaction) return null; // If no transaction data is passed, return null (don't render anything)

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose} // Close the modal when clicking on the overlay
    >
      <div
        className="bg-gray-800 p-6 rounded-xl border border-gray-700 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal content
      >
        <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent p-3 text-center">
          Transaction Details
        </h3>
        <div className="space-y-4 text-white text-sm md:text-xl">
          {/* Transaction ID */}
          <p className="flex items-center gap-4">
            <span className="font-semibold text-xl text-blue-400">
              Transaction ID:
            </span>
            <span className="block text-xl text-gray-200">
              {transaction.transaction_id}
            </span>
          </p>
          
          {/* Transaction Date */}
          <p className="flex items-center gap-4">
            <span className="font-semibold text-xl text-blue-400">Date:</span>
            <span className="block text-xl text-gray-200">
              {new Date(transaction.date_time).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </p>
          
          {/* Transaction Time */}
          <p className="flex items-center gap-4">
            <span className="font-semibold text-xl text-blue-400">Time:</span>
            <span className="block text-xl text-gray-200">
              {new Date(transaction.date_time).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </p>

          {/* Transaction Type (Credit/Debit) */}
          <p className="flex items-center gap-4">
            <span className="font-semibold text-xl text-blue-400">Type:</span>
            <span
              className={`block text-xl ${
                transaction.transaction_type === "credit"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {transaction.transaction_type
                .charAt(0)
                .toUpperCase() + transaction.transaction_type.slice(1)}
            </span>
          </p>

          {/* Transaction Amount */}
          <p className="flex items-center gap-4">
            <span className="font-semibold text-xl text-blue-400">Amount:</span>
            <span
              className={`block text-xl ${
                transaction.transaction_type === "credit"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              ${Number(transaction.amount).toFixed(2)}
            </span>
          </p>

          {/* Transaction Description */}
          <p>
            <span className="font-semibold text-xl text-blue-400">
              Description:
            </span>
            <span className="block text-xl text-gray-200 ml-3">
              {transaction.description}
            </span>
          </p>

          {/* Transaction Category */}
          <p className="flex items-center gap-4">
            <span className="font-semibold text-xl text-blue-400">
              Category:
            </span>
            <span className="block text-xl text-gray-200">
              {transaction.category_name}
            </span>
          </p>

          {/* Transaction Balance */}
          <p className="flex items-center gap-4">
            <span className="font-semibold text-xl text-blue-400">Balance:</span>
            <span className="block text-xl text-gray-200">
              {Number(transaction.balance).toFixed(2)}
            </span>
          </p>
        </div>

        {/* Close Button */}
        <button
          className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition"
          onClick={onClose} // Close the modal when clicked
        >
          Close
        </button>
      </div>
    </div>
  );
}
