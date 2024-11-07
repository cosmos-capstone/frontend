export default function Dashboard() {
  return (
    <div className="m-8 bg-white p-8 mb-5 rounded-lg shadow-md">
      <div className="mb-3">
        <h2 className="text-2xl font-semibold">Overview</h2>
        <div className="flex justify-between mt-4">
          <div className="text-center bg-gray-100 p-4 rounded-lg w-1/4 shadow-sm">
            <div>총 자산</div>
            <div className="font-bold">$50,000</div>
          </div>
          <div className="text-center bg-gray-100 p-4 rounded-lg w-1/4 shadow-sm">
            <div>주식</div>
            <div className="font-bold">$100,000</div>
          </div>
          <div className="text-center bg-gray-100 p-4 rounded-lg w-1/4 shadow-sm">
            <div>ETF</div>
            <div className="font-bold">$500,000</div>
          </div>
          <div className="text-center bg-gray-100 p-4 rounded-lg w-1/4 shadow-sm">
            <div>채권</div>
            <div className="font-bold">$500,000</div>
          </div>
        </div>
      </div>
    </div>
  );
}