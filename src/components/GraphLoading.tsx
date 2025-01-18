export default function BarGraphSkeleton({
  bars = 5, // Default number of bars in the skeleton graph
  width = "w-full", // Default width of the graph container
  height = "h-64", // Default height of the graph container
}: {
  bars?: number; // Optional number of bars, defaults to 5
  width?: string; // Optional width class, defaults to "w-full"
  height?: string; // Optional height class, defaults to "h-64"
}) {
  return (
    <div
      className={`relative ${width} ${height} bg-gray-800 rounded-lg p-4 animate-pulse`}
    >
      {/* Graph Title Placeholder */}
      {/* This div represents a placeholder for the graph title, styled with a small height and gray background */}
      <div className="h-4 w-1/4 bg-gray-600 rounded mb-6 mx-auto"></div>

      {/* Gridlines */}
      {/* This div holds the gridlines for the skeleton graph. It uses absolute positioning to fill the container */}
      <div className="absolute left-8 top-6 right-6 bottom-8 grid grid-rows-4">
        {/* Looping through an array of size 4 to create gridlines */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border-b border-gray-700"></div> // Create horizontal gridlines with gray color
        ))}
      </div>

      {/* Bars */}
      {/* This div holds the bars of the skeleton graph. Positioned at the bottom of the container with flexbox layout */}
      <div className="absolute left-8 bottom-8 right-6 flex items-end justify-between">
        {/* Looping through the number of bars specified */}
        {[...Array(bars)].map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            {/* Bar Placeholder */}
            {/* Each bar has a random height between 20% and 80% to simulate varying bar heights */}
            <div
              className="w-3/4 bg-gray-600 rounded-lg"
              style={{ height: `${Math.random() * 60 + 20}%` }} // Set random height between 20% and 80%
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}
