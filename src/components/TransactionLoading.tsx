export default function TransactionLoading({items}:{items:number}) {
  return (
    <div className="space-y-4 p-4 px-6  w-full  mx-auto">
    {[...Array(items)].map((_, index) => (
      <div key={index} className="flex space-x-4 py-4 animate-pulse">
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded-xl"></div>
        </div>
      </div>
    ))}
  </div>
  );
}
