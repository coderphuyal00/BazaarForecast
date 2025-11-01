import { useEffect, useState, useContext, useRef } from "react";
import AuthContext from "../components/context/AuthContext";
import StockDataContext from "../components/context/StockDataContext";
function StorePortfolioValue() {
  const { authTokens } = useContext(AuthContext);
  const hasSentRequest = useRef(false);
  const { UserStocks } = useContext(StockDataContext);
  const [userStocks, setUserStocks] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [currentDate, setCurrentDate] = useState();
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
  async function PortfolioValue() {
    const cacheKey = "userPortfolioData";
    const cacheTimestampKey = "nepseChartDataTimestamp";

    const now = new Date();
    const currentHour = now.getHours();
    if (currentHour < 15) {
      return;
    }

    const cachedData = localStorage.getItem(cacheKey);
    const cachedTimestamp = localStorage.getItem(cacheTimestampKey);

    if (cachedData && cachedTimestamp) {
      const cachedDate = new Date(cachedTimestamp);
      const diffInDays = (now - cachedDate) / (1000 * 60 * 60 * 24);
      if (diffInDays < 1) {
        // Already sent today
        return JSON.parse(cachedData);
      }
    }

    if (!totalValue || totalValue === 0) {
      return;
    }

    try {
      // Check existing entries from backend for today
      const checkResponse = await fetch("http://127.0.0.1:8000/api/user/portfolio/", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + authTokens?.access,
          "Content-Type": "application/json",
        },
      });

      if (!checkResponse.ok) {
        // console.error("Failed to fetch today's portfolio data");
        return;
      }
      const todayData = await checkResponse.json();

      if (todayData && todayData.portfolio_value_date === currentDate) {
        // Duplicate found - already have today's entry
        // console.log("Today's portfolio value already exists, skipping POST.");
        // Update cache to prevent repeated attempts
        localStorage.setItem(cacheKey, JSON.stringify(todayData));
        localStorage.setItem(cacheTimestampKey, now.toISOString());
        return;
      }

      // No duplicate, proceed to add
      const response = await fetch("http://127.0.0.1:8000/api/user/portfolio/add/", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + authTokens?.access,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          portfolio_value_date: currentDate,
          portfolio_value: totalValue,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData);
      } else {
        // console.log("Added portfolio value successfully");
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
}, []);

}


export default StorePortfolioValue;
