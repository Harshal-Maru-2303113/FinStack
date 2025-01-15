import { motion } from "framer-motion";

interface BudgetModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCategory: number | null;
  amount: number;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
  handleAddBudget: () => void;
  isEditMode: boolean;
  categories: { category_id: number; name: string }[]; // Added categories prop
  setSelectedCategory: React.Dispatch<React.SetStateAction<number | null>>; // Added function to set selected category
}

const BudgetModal = ({
  isOpen,
  setIsOpen,
  selectedCategory,
  amount,
  setAmount,
  handleAddBudget,
  isEditMode,
  categories,
  setSelectedCategory,
}: BudgetModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
      <motion.div
        className="bg-gray-800 p-6 rounded-lg w-full max-w-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">
            {isEditMode ? "Edit Budget" : "Add Budget"}
          </h2>
          <button
            className="text-white text-xl"
            onClick={() => setIsOpen(false)}
          >
            &times;
          </button>
        </div>

        <div className="mb-4">
          <label className="text-gray-300">Select Category</label>
          <select
            value={selectedCategory || ""}
            onChange={(e) => setSelectedCategory(parseInt(e.target.value))}
            className="mt-2 w-full p-2 bg-gray-700 text-white rounded-lg"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="text-gray-300">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            className="mt-2 w-full p-2 bg-gray-700 text-white rounded-lg"
            placeholder="Enter amount"
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            className="bg-gray-600 px-6 py-2 rounded-lg text-white"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button
            className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded-lg text-white"
            onClick={handleAddBudget}
          >
            {isEditMode ? "Update Budget" : "Add Budget"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default BudgetModal;
