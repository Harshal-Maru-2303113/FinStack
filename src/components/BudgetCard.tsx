import { motion } from "framer-motion";
import { FiTrash2, FiEdit } from "react-icons/fi";

interface BudgetCardProps {
  category: { category_id: number, name: string, allocated: number, spent: number };
  index: number;
  onEdit: (categoryId: number) => void;
  onRemove: (categoryId: number) => void;
  onBudgetChange: (index: number, event: React.ChangeEvent<HTMLInputElement>) => void;
}

const BudgetCard: React.FC<BudgetCardProps> = ({ category, index, onEdit, onRemove, onBudgetChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gray-800 rounded-xl p-4 border border-gray-700"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-white font-semibold">{category.name}</h3>
        <span className="text-gray-400 text-sm">
          ${category.spent}/{category.allocated}
        </span>
      </div>

      <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{
            width: `${(category.spent / category.allocated) * 100}%`,
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-600"
        />
      </div>

      {/* Budget Input */}
      <div className="mt-4">
        <label className="text-gray-300">Set Budget</label>
        <input
          type="number"
          value={category.allocated}
          onChange={(e) => onBudgetChange(index, e)}
          className="mt-2 w-full p-2 bg-gray-700 text-white rounded-lg"
          placeholder="Enter budget"
        />
      </div>

      {/* Edit and Remove Buttons */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => onEdit(category.category_id)}
          className="text-blue-500 hover:text-blue-700"
        >
          <FiEdit size={20} />
        </button>
        <button
          onClick={() => onRemove(category.category_id)}
          className="text-red-500 hover:text-red-700"
        >
          <FiTrash2 size={20} />
        </button>
      </div>
    </motion.div>
  );
};

export default BudgetCard;
