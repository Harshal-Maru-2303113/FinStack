import { Dispatch, SetStateAction } from "react";  // Importing necessary types for state management
import { FaTimes } from "react-icons/fa";  // Icon for closing categories
import { categories } from "@/utils/categories";  // Import categories list for filtering
import { Filters, TransactionType } from "@/hooks/useFilters";  // Importing custom types for filters

interface FilterOverlayProps {
  filters: Filters;  // The current filter settings
  setFilters: Dispatch<SetStateAction<Filters>>;  // Function to update filters state
  applyFilters: () => void;  // Function to apply the filters
  closeOverlay: () => void;  // Function to close the filter overlay
}

export default function FilterOverlay({
  filters,
  setFilters,
  applyFilters,
  closeOverlay,
}: FilterOverlayProps) {
  // Function to handle adding a new category to the selected filters
  const handleCategoryChange = (value: string) => {
    const currentCategories = filters.category;
    if (!currentCategories.includes(value)) {
      const updatedCategories = [...currentCategories, value];
      setFilters({
        ...filters,
        category: updatedCategories,  // Update the category filter
      });
    }
  };

  // Function to remove a category from the selected filters
  const removeCategory = (value: string) => {
    const currentCategories = filters.category;
    const updatedCategories = currentCategories.filter(
      (item) => item !== value
    );
    setFilters({
      ...filters,
      category: updatedCategories,  // Update the category filter
    });
  };

  return (
    // Overlay container with background color and flex to center content
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={closeOverlay}  // Close overlay when clicking outside
    >
      <div
        className="bg-gray-800 p-6 rounded-xl border border-gray-700 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}  // Prevent closing when clicking inside the overlay
      >
        <h3 className="text-2xl font-bold text-white mb-4">Apply Filters</h3>
        <div className="space-y-4">
          {/* Date Options */}
          <select
            className="w-full p-2 bg-gray-700 text-white rounded-lg"
            value={filters.dateType}
            onChange={(e) =>
              setFilters({ ...filters, dateType: e.target.value })  // Update date type filter
            }
          >
            <option value="">Date Options</option>
            <option value="single">Single</option>
            <option value="range">Range</option>
            <option value="custom">Custom</option>
          </select>

          {/* Single date input if dateType is 'single' */}
          {filters.dateType === "single" && (
            <input
              type="date"
              className="w-full p-2 bg-gray-700 text-white rounded-lg"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })  // Set the start date
              }
              placeholder="Date"
            />
          )}

          {/* Date range options if dateType is 'range' */}
          {filters.dateType === "range" && (
            <select
              className="w-full p-2 bg-gray-700 text-white rounded-lg"
              value={filters.rangeOption}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  rangeOption: e.target.value,  // Set date range option
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

          {/* Custom date range inputs */}
          {filters.dateType === "custom" && (
            <div className="flex gap-4">
              <input
                type="date"
                className="w-1/2 p-2 bg-gray-700 text-white rounded-lg"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    startDate: e.target.value,  // Set custom start date
                  })
                }
                placeholder="Start Date"
              />
              <input
                type="date"
                className="w-1/2 p-2 bg-gray-700 text-white rounded-lg"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })  // Set custom end date
                }
                placeholder="End Date"
              />
            </div>
          )}

          {/* Amount filter options */}
          <select
            className="w-full p-2 bg-gray-700 text-white rounded-lg"
            value={filters.amountType}
            onChange={(e) =>
              setFilters({ ...filters, amountType: e.target.value })  // Update amount type filter
            }
          >
            <option value="">Amount Options</option>
            <option value="single">Single</option>
            <option value="range">Range</option>
          </select>

          {/* Single amount input if amountType is 'single' */}
          {filters.amountType === "single" && (
            <input
              type="number"
              className="w-full p-2 bg-gray-700 text-white rounded-lg"
              value={filters.amount}
              onChange={(e) =>
                setFilters({ ...filters, amount: e.target.value })  // Set specific amount
              }
              placeholder="Amount"
            />
          )}

          {/* Range amount inputs if amountType is 'range' */}
          {filters.amountType === "range" && (
            <div className="flex gap-4">
              <input
                type="number"
                className="w-1/2 p-2 bg-gray-700 text-white rounded-lg"
                value={filters.minAmount}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    minAmount: e.target.value,  // Set minimum amount
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
                    maxAmount: e.target.value,  // Set maximum amount
                  })
                }
                placeholder="Max Amount"
              />
            </div>
          )}

          {/* Category selection dropdown */}
          <select
            className="w-full p-2 bg-gray-700 text-white rounded-lg appearance-none transition-all duration-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value="" // Prevent default selection
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              handleCategoryChange(e.target.value)  // Add selected category
            }
          >
            <option value="">Select Categories</option>
            {categories.map((category) => (
              <option
                key={category.category_id}
                value={category.name}
                disabled={filters.category.includes(category.name)}  // Disable already selected categories
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
                  className="bg-blue-600 text-white px-3 rounded-full flex justify-center items-center shadow-md transition-transform transform hover:scale-105"
                >
                  {selectedCategory}
                  <button
                    className="ml-2 text-xs text-white bg-red-500 rounded-full h-1/2 p-1 transition-colors duration-300 hover:bg-red-700"
                    onClick={() => removeCategory(selectedCategory)}  // Remove category when clicked
                  >
                    <FaTimes className="mb-[1.375rem] text-xs" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Transaction type filter */}
          <select
            className="w-full p-2 bg-gray-700 text-white rounded-lg"
            value={filters.transaction_type}
            onChange={(e) =>
              setFilters({
                ...filters,
                transaction_type: e.target.value as TransactionType,  // Update transaction type filter
              })
            }
          >
            <option value="">All Types</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
        </div>
        
        {/* Apply Filters Button */}
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
