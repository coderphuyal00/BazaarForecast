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
        // const stocks = await UserStocks();
        setUserStocks(UserStocks);
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
            const todayClosePrice = item?.stock.prices.at(-1).close_price;
            const dates = item?.stock.prices.at(-1).date;
            setCurrentDate(dates);
            return todayClosePrice * item.quantity;
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
            {totalValue.toLocaleString("en-US")}
            
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
    return (
      <div className=" font-bold text-gray-800 dark:text-gray-100 dark:font-bold">
        Rs.{totalValue.toLocaleString("en-US")}
      </div>
    );
  }
}

export default TotalStockValue;
