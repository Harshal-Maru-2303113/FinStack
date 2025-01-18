export default function TransactionLoading({ items, width }: { items: number; width?: string }) {
  // Set the width of the loading component, default to "w-full" if not provided
  const barWidth = width ? width : "w-full";

  return (
    <div className={`space-y-4 p-4 px-6 ${barWidth} mx-auto`}>
      {/* Create an array of loading items based on the 'items' prop */}
      {[...Array(items)].map((_, index) => (
        <div key={index} className="flex space-x-4 py-4 animate-pulse">
          {/* Each loading item has a flex container for layout */}
          <div className="flex-1 space-y-2">
            {/* Placeholder for transaction information */}
            <div className="h-4 bg-gray-300 rounded-xl"></div> {/* Placeholder for the title */}
          </div>
        </div>
      ))}
    </div>
  );
}
