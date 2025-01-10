import { Dispatch, SetStateAction } from "react";
import { FaTimes } from "react-icons/fa";
import { categories } from "@/utils/categories";
import { Filters, TransactionType } from "@/hooks/useFilters";

interface FilterOverlayProps {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  applyFilters: () => void;
  closeOverlay: () => void;
}

export default function FilterOverlay({
  filters,
  setFilters,
  applyFilters,
  closeOverlay,
}: FilterOverlayProps) {
  const handleCategoryChange = (value: string) => {
    const currentCategories = filters.category;
    if (!currentCategories.includes(value)) {
      const updatedCategories = [...currentCategories, value];
      setFilters({
        ...filters,
        category: updatedCategories,
      });
    }
  };

  const removeCategory = (value: string) => {
    const currentCategories = filters.category;
    const updatedCategories = currentCategories.filter(
      (item) => item !== value
    );
    setFilters({
      ...filters,
      category: updatedCategories,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={closeOverlay}
    >
      <div
        className="bg-gray-800 p-6 rounded-xl border border-gray-700 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold text-white mb-4">Apply Filters</h3>
        <div className="space-y-4">
          {/* Date Options */}
          <select
            className="w-full p-2 bg-gray-700 text-white rounded-lg"
            value={filters.dateType}
            onChange={(e) =>
              setFilters({ ...filters, dateType: e.target.value })
            }
          >
            <option value="">Date Options</option>
            <option value="single">Single</option>
            <option value="range">Range</option>
            <option value="custom">Custom</option>
          </select>

          {filters.dateType === "single" && (
            <input
              type="date"
              className="w-full p-2 bg-gray-700 text-white rounded-lg"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
              placeholder="Date"
            />
          )}

          {filters.dateType === "range" && (
            <select
              className="w-full p-2 bg-gray-700 text-white rounded-lg"
              value={filters.rangeOption}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  rangeOption: e.target.value,
                })
              }
            >
              <option value="">Select Range</option>
              <option value="lastHour">Last Hour</option>
              <option value="lastDay">Last Day</option>
              <option value="lastWeek">Last Week</option>
              <option value="lastMonth">Last Month</option>
              <option value="lastYear">Last Year</option>
            </select>
          )}

          {filters.dateType === "custom" && (
            <div className="flex gap-4">
              <input
                type="date"
                className="w-1/2 p-2 bg-gray-700 text-white rounded-lg"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    startDate: e.target.value,
                  })
                }
                placeholder="Start Date"
              />
              <input
                type="date"
                className="w-1/2 p-2 bg-gray-700 text-white rounded-lg"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
                placeholder="End Date"
              />
            </div>
          )}

          {/* Amount Options */}
          <select
            className="w-full p-2 bg-gray-700 text-white rounded-lg"
            value={filters.amountType}
            onChange={(e) =>
              setFilters({ ...filters, amountType: e.target.value })
            }
          >
            <option value="">Amount Options</option>
            <option value="single">Single</option>
            <option value="range">Range</option>
          </select>

          {filters.amountType === "single" && (
            <input
              type="number"
              className="w-full p-2 bg-gray-700 text-white rounded-lg"
              value={filters.amount}
              onChange={(e) =>
                setFilters({ ...filters, amount: e.target.value })
              }
              placeholder="Amount"
            />
          )}

          {filters.amountType === "range" && (
            <div className="flex gap-4">
              <input
                type="number"
                className="w-1/2 p-2 bg-gray-700 text-white rounded-lg"
                value={filters.minAmount}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    minAmount: e.target.value,
                  })
                }
                placeholder="Min Amount"
              />
              <input
                type="number"
                className="w-1/2 p-2 bg-gray-700 text-white rounded-lg"
                value={filters.maxAmount}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    maxAmount: e.target.value,
                  })
                }
                placeholder="Max Amount"
              />
            </div>
          )}

          {/* Category and Type */}
          <select
            className="w-full p-2 bg-gray-700 text-white rounded-lg appearance-none transition-all duration-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value="" // Prevent default selection
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              handleCategoryChange(e.target.value)
            }
          >
            <option value="">Select Categories</option>
            {categories.map((category) => (
              <option
                key={category.category_id}
                value={category.name}
                disabled={filters.category.includes(category.name)}
              >
                {category.name}
              </option>
            ))}
          </select>

          {/* Display selected categories as tags */}
          {filters.category && (
            <div className="mt-2 flex flex-wrap gap-2">
              {filters.category.map((selectedCategory) => (
                <span
                  key={selectedCategory}
                  className="bg-blue-600 text-white px-3  rounded-full flex justify-center items-center shadow-md transition-transform transform hover:scale-105"
                >
                  {selectedCategory}
                  <button
                    className="ml-2 text-xs text-white bg-red-500 rounded-full h-1/2 p-1 transition-colors duration-300 hover:bg-red-700"
                    onClick={() => removeCategory(selectedCategory)}
                  >
                    <FaTimes className="mb-[1.375rem] text-xs" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <select
            className="w-full p-2 bg-gray-700 text-white rounded-lg"
            value={filters.transaction_type}
            onChange={(e) =>
              setFilters({
                ...filters,
                transaction_type: e.target.value as TransactionType,
              })
            }
          >
            <option value="">All Types</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
        </div>
        <button
          onClick={applyFilters}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}