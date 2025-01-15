"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { categories } from "@/utils/categories"; // Importing categories
import BudgetCard from "@/components/BudgetCard";
import BudgetModal from "@/components/BudgetModal";

export default function BudgetPage() {
  const [categoryData, setCategoryData] = useState(
    categories.map((category) => ({
      ...category,
      allocated: 0,
      spent: 0,
    }))
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [isEditMode, setIsEditMode] = useState(false); // New state for Edit mode

  // Handle Budget Change (Allocate or Update)
  const handleBudgetChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const newCategoryData = [...categoryData];
    newCategoryData[index].allocated = parseFloat(event.target.value);
    setCategoryData(newCategoryData);
  };

  const handleAddBudget = () => {
    if (selectedCategory !== null && amount > 0) {
      const updatedCategoryData = [...categoryData];
      updatedCategoryData[selectedCategory].allocated = amount;
      setCategoryData(updatedCategoryData);
      setIsModalOpen(false);
      setSelectedCategory(null);
      setAmount(0);
      setIsEditMode(false); // Reset edit mode
    }
  };

  const handleEditBudget = (categoryId: number) => {
    const category = categoryData.find((cat) => cat.category_id === categoryId);
    if (category) {
      setSelectedCategory(categoryId);
      setAmount(category.allocated);
      setIsEditMode(true);
      setIsModalOpen(true);
    }
  };

  const handleRemoveBudget = (categoryId: number) => {
    const newCategoryData = categoryData.filter((cat) => cat.category_id !== categoryId);
    setCategoryData(newCategoryData);
  };

  return (
    <div className="flex">
      <Navigation />
      <div className="flex-1 md:ml-64 p-4">
        <div className="p-4 md:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[1400px] mx-auto"
          >
            <div className="grid gap-6">
              {/* Add Budget Button */}
              <div className="flex justify-between items-center mb-6">
                <motion.button
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all"
                  onClick={() => setIsModalOpen(true)}
                >
                  Add Budget
                </motion.button>
              </div>

              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categoryData.map(
                  (category, index) =>
                    category.allocated > 0 && (
                      <BudgetCard
                        key={category.category_id}
                        category={category}
                        index={index}
                        onEdit={handleEditBudget}
                        onRemove={handleRemoveBudget}
                        onBudgetChange={handleBudgetChange}
                      />
                    )
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Budget Modal */}
      {isModalOpen && (
        <BudgetModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          selectedCategory={selectedCategory}
          amount={amount}
          setAmount={setAmount}
          handleAddBudget={handleAddBudget}
          isEditMode={isEditMode}
          categories={categories} // Pass categories here
          setSelectedCategory={setSelectedCategory} // Pass function to set selected category
        />
      )}
    </div>
  );
}
