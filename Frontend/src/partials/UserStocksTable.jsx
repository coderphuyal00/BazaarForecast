import { useContext, useEffect, useState } from "react";
import StockDataContext from "../components/context/StockDataContext";
import {
  StockClosePrice,
  StockPriceDiff,
  StockValue,
} from "./StockClosePrices";
function UserStocksTable() {
  const { UserStocks } = useContext(StockDataContext);

  const [userStock, setUserStock] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [sortBy, setSortBy] = useState("id"); // Default sorting by ID
  const [sortOrder, setSortOrder] = useState("asc"); // Default ascending order
  useEffect(() => {
    if (UserStocks) {
      setUserStock(UserStocks);
      //   console.log(UserStocks)
    } else {
      setUserWatchList("loading");
    }
  }, [UserStocks]);

  const uniqueCities = [...new Set(userStock?.map((item) => item.stock.name))];

  //   const filteredData = userStock?.filter(
  //     (item) =>
  //       (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         item.city.toLowerCase().includes(searchTerm.toLowerCase())) &&
  //       (filterCity === "" || item.city === filterCity)
  //   );
  // Function to handle sorting
  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  // Sorting logic based on sortBy and sortOrder
  const sortedData = [...UserStocks].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    if (sortOrder === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
    }
  });
  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  }
  function convertToLotsWithDecimal(shares, lotSize = 100, decimalPlaces = 2) {
    const fullLots = Math.floor(shares / lotSize);
    const remainderShares = shares % lotSize;
    const decimalPart = remainderShares / lotSize;
    const formattedDecimal = decimalPart.toFixed(decimalPlaces).slice(1); // keeps the decimal point and digits

    return `${fullLots}${formattedDecimal}`;
  }

  return (
    <div className="flex flex-col col-span-full sm:col-span-12 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          My Stocks
        </h2>
      </header>
      <div className="overflow-x-auto p-5">
        <table className="table-auto w-full dark:text-gray-300">
          {/* Table header */}
          <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-xs">
            <tr>
              <th className="p-2">
                <div className="font-semibold text-left">Stock</div>
              </th>
              <th className="p-2">
                <div className="font-semibold text-center">Invest Date</div>
              </th>
              <th className="p-2">
                <div className="font-semibold text-center">Price</div>
              </th>
              <th className="p-2">
                <div className="font-semibold text-center">% Change</div>
              </th>
              <th className="p-2">
                <div className="font-semibold text-center">Number of lots</div>
              </th>
            </tr>
          </thead>
          {/* Table body */}
          <tbody className="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700/60">
            {/* Row */}
            {userStock?.map((item) => (
              <tr key={item.stock.name}>
                <td className="p-2">
                  <div className="flex items-left flex-col">
                    <div
                      className="text-gray-800  text-base dark:text-gray-100 cursor-pointer"
                      onClick={() => handleClick(item.stock.ticker)}
                    >
                      {item.stock.ticker}
                    </div>
                    <div className="text-gray-500 font-normal text-sm dark:text-gray-100">
                      {item.stock.name}
                    </div>
                  </div>
                </td>

                <td className="p-2">
                  <div className="text-center">
                    {formatDate(item.purchase_date)}
                  </div>
                </td>
                <td className="p-2">
                  <div className="text-center">
                    <p>Rs.{item.stock.prices.at(-1).close_price}</p>
                  </div>
                </td>
                <td className="p-2 text-center">
                  <div className="text-sm ">
                    <StockPriceDiff
                      TickerPrices={item.stock.prices}
                      displayLocation="user-stock-table"
                    />
                  </div>
                </td>
                <td className="p-2">
                  <div className="text-center">
                    <p className="text-blue-700 font-thin">{convertToLotsWithDecimal(item.quantity)} Lots</p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserStocksTable;
