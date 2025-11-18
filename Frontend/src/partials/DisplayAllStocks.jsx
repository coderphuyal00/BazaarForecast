import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
function StockPriceTable() {
  const [stocks, setStocks] = useState([]);
  const [updatedDate, setupdatedTime] = useState();
 const navigate = useNavigate();
  useEffect(() => {
    async function fetchStockPrices() {
      try {
        const response = await fetch(
          "https://sharehubnepal.com/live/api/v2/nepselive/live-nepse"
        ); // Replace with real API
        const data = await response.json();
        setStocks(data.data);
        // console.log(data.data);
        const lastDate = new Date(data.data[0].lastUpdatedDateTime);
        setupdatedTime(lastDate.toLocaleString());
      } catch (error) {
        console.error("Failed to fetch stock data:", error);
      }
    }
    fetchStockPrices();
  }, []);
  const handleClick = (ticker) => {
    navigate(`/stock/${ticker}`);
    window.location.reload();
  };
  const sortedStocks = [...stocks].sort((a, b) =>
    a.symbol.localeCompare(b.symbol)
  );
  return (
    <div className="flex overflow-auto font-sans font-medium flex-col col-span-full sm:col-span-full xl:col-span-full bg-white dark:bg-gray-800 shadow-xs rounded-xl h-96">
      <header className="px-5 flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
        <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
          Stocks Table
        </h2>
        <span className="font-semibold">Last Updated: {updatedDate}</span>
      </header>
      <table className="min-w-full px-5 overflow-auto table-auto bg-white border border-gray-200 dark:border-gray-800 dark:bg-gray-800 rounded shadow-sm dark:text-gray-300">
        <thead className="text-gray-400 bg-gray-50 dark:bg-gray-800 sticky top-0 z-1000 ">
          <tr>
            {[  
              "Symbol",
              "LTP",
              "Change",
              "Change %",
              "Open",
              "High",
              "Low",
              "Total Turnover",
              "Total Volume",
            ].map((header) => (
              <th
                key={header}
                className="py-3 px-4 border-b border-gray-300 dark:border-gray-100 text-left text-sm font-medium text-gray-700 dark:text-gray-100"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="overflow-y-scroll dark:text-gray-100">
          {sortedStocks?.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center py-4 text-gray-500">
                Loading...
              </td>
            </tr>
          ) : (
            sortedStocks?.map((stock) => (
              <tr key={stock.symbol} className="even:bg-gray-50 dark:bg-gray-800">
                <td className="py-2 px-4 border-b border-gray-200">
                  <div
                    className="text-gray-800  text-base dark:text-gray-100 cursor-pointer"
                    onClick={() => handleClick(stock.symbol)}
                  >
                    {stock.symbol}
                  </div>
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {stock.lastTradedPrice}
                </td>
                <td
                  className={`py-2 px-4 border-b border-gray-200 ${
                    stock.change >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stock.change}
                </td>
                <td
                  className={`py-2 px-4 border-b border-gray-200 ${
                    stock.percentageChange >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stock.percentageChange}%
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {stock.openPrice}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {stock.highPrice}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {stock.lowPrice}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {stock.totalTradeValue}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {stock.totalTradeQuantity}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StockPriceTable;
