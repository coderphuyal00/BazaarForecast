import { useState, useEffect, useContext } from "react";
import StockDataContext from "../components/context/StockDataContext";
import AuthContext from "../components/context/AuthContext";
function TotalStockValue({ displayLocation }) {
  const { UserStocks, fetchDataOncePerDay } = useContext(StockDataContext);
  const { authTokens } = useContext(AuthContext);
  const [userStocks, setUserStocks] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [currentDate, setCurrentDate] = useState();
  const [isGain, setGain] = useState();
  const [priceDiff, setPriceDiff] = useState();

  useEffect(() => {
    async function fetchUserStocks() {
      try {
        const stocks = await UserStocks();
        setUserStocks(stocks);
      } catch (err) {
        console.error("Failed to fetch user stocks:", err);
      }
    }
    fetchUserStocks();
  }, [UserStocks]);

  useEffect(() => {
    if (userStocks.length === 0) {
      setTotalValue(0);
      return;
    }

    async function fetchStockPricesAndCalculateTotal() {
      try {
        const stockValues = await Promise.all(
          userStocks.map(async (item) => {
            const response = await fetch(
              `http://127.0.0.1:8000/api/stock/1D/${item.stock.ticker}/`
            );
            if (!response.ok) {
              throw new Error(
                `Failed to fetch stock data for ${item.stock.ticker}`
              );
            }
            const data = await response.json();
            const closePrices = data.map((d) => d.close_price);
            const dates = data.map((d) => d.date);
            const lastPrice = closePrices[closePrices.length - 1] || 0;
            const lastDate = dates[dates.length - 1] || 0;
            setCurrentDate(lastDate);
            return lastPrice * item.quantity;
          })
        );

        const total = stockValues.reduce((acc, val) => acc + val, 0);
        setTotalValue(total);
      } catch (error) {
        console.error("Error calculating total stock value:", error);
        setTotalValue(0); // fallback value
      }
    }

    fetchStockPricesAndCalculateTotal();
  }, [userStocks]);
  useEffect(() => {
    async function PortfolioValue() {
      const cacheKey = "userPortfolioData";
      const cacheTimestampKey = "nepseChartDataTimestamp";

      const cachedData = localStorage.getItem(cacheKey);
      const cachedTimestamp = localStorage.getItem(cacheTimestampKey);

      const now = new Date();

      if (cachedData && cachedTimestamp) {
        const cachedDate = new Date(cachedTimestamp);
        const diffInDays = (now - cachedDate) / (1000 * 60 * 60 * 24);

        if (diffInDays < 1) {
          // Data was sent within last 24 hours, no need to send again
          // console.log("Using cached data, skipping API call.");
          return JSON.parse(cachedData);
        }
      }

      if (!totalValue || totalValue === 0) {
        // Optional: avoid sending invalid or empty totalValue
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/user/portfolio/add/",
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + authTokens?.access,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              portfolio_value_date: currentDate,
              portfolio_value: totalValue,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error:", errorData);
        } else {
          console.log("Added portfolio value successfully");

          // Update cache after successful upload
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              portfolio_value_date: currentDate,
              portfolio_value: totalValue,
            })
          );
          localStorage.setItem(cacheTimestampKey, now.toISOString());
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    PortfolioValue();
  }, [currentDate]);
  useEffect(() => {
    async function fetchUserStockPortfolioValue() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/user/portfolio/",
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + authTokens?.access,
            },
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error:", errorData);
        } else {
          const apiData = await response.json();
          const portfolio_dates = apiData.map((item) => {
            item.portfolio_value_date;
          });
          const portfolio_values = apiData.map((item) => {
            item.portfolio_value;
          });
          const last_date_element =
            portfolio_dates[portfolio_dates.length - 1] || 0;
          const last_value_element =
            portfolio_values[portfolio_values.length - 1] || 0;

          const diffPercentage = () => {
            let secondLastElement = portfolio_values[portfolio_values - 2];
            // console.log(secondLastElement);
            let percentageDiff =
              ((last_value_element - secondLastElement) / secondLastElement) *
              100;
            if (last_value_element > secondLastElement) {
              setGain(true);
            } else {
              setGain(false);
            }
            function truncateDecimals(num, digits) {
              const multiplier = Math.pow(10, digits);
              return ~~(num * multiplier) / multiplier;
            }
            return truncateDecimals(percentageDiff, 2);
          };
          setPriceDiff(diffPercentage());
        }
      } catch (err) {
        console.error("Failed to fetch user stocks:", err);
      }
    }
    fetchUserStockPortfolioValue();
  }, []);
  if (displayLocation === "sidebar") {
    return (
      <>
        <div className="">
          <span className="text-sm text-gray-400">Total Investment</span>
        </div>
        <div className="flex items-start">
          <div className="text-3xl font-bold text-[#d8dbe2] dark:text-[#a9bcd0] mr-2">
            {totalValue}
          </div>
          {isGain ? (
            <div className="text-sm font-medium text-green-700 mt-2 px-1.5 bg-green-500/20 rounded-full">
              +{priceDiff}%
            </div>
          ) : (
            <div className="text-sm font-medium text-red-700 mt-2 px-1.5 bg-red-500/20 rounded-full">
              {priceDiff}%
            </div>
          )}
          {/* <div className="text-sm font-medium text-green-700 mt-2 px-1.5 bg-green-500/20 rounded-full">
            +49%
          </div> */}
        </div>
      </>
    ); // formatted to 2 decimals
  }
  if (displayLocation === "stock-table") {
    return(
    <div className=" font-bold text-gray-800 dark:text-gray-100 dark:font-bold">Rs.{totalValue}</div>
    )
  }
}

export default TotalStockValue;
