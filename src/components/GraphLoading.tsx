export default function BarGraphSkeleton({
    bars = 5,
    width = "w-full",
    height = "h-64",
  }: {
    bars?: number;
    width?: string;
    height?: string;
  }) {
    return (
      <div className={`relative ${width} ${height} bg-gray-800 rounded-lg p-4 animate-pulse`}>
        {/* Graph Title Placeholder */}
        <div className="h-4 w-1/4 bg-gray-600 rounded mb-6 mx-auto"></div>
  
        {/* Gridlines */}
        <div className="absolute left-8 top-6 right-6 bottom-8 grid grid-rows-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border-b border-gray-700"></div>
          ))}
        </div>
  
        {/* Bars */}
        <div className="absolute left-8 bottom-8 right-6 flex items-end justify-between">
          {[...Array(bars)].map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center"
            >
              {/* Bar Placeholder */}
              <div
                className="w-3/4 bg-gray-600 rounded-lg"
                style={{ height: `${Math.random() * 60 + 20}%` }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  