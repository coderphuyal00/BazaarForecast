import { useEffect, useState, useContext, useRef } from "react";
import AuthContext from "../components/context/AuthContext";
import StockDataContext from "../components/context/StockDataContext";

function StorePortfolioValue() {
  const { authTokens } = useContext(AuthContext);
  const hasSentRequest = useRef(false);
  const { UserStocks } = useContext(StockDataContext);
  const [userStocks, setUserStocks] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    async function fetchUserStocks() {
      try {
        // Set user stocks from context
        setUserStocks(UserStocks);
      } catch (err) {
        console.error("Failed to fetch user stocks:", err);
      }
    }
    fetchUserStocks();
  }, [UserStocks]);

  useEffect(() => {
    if (!userStocks || userStocks.length === 0) {
      setTotalValue(0);
      return;
    }

    async function fetchStockPricesAndCalculateTotal() {
      try {
        // Calculate total portfolio value and get latest date
        const stockValues = await Promise.all(
          userStocks.map(async (item) => {
            const latestPriceObj = item?.stock.prices.at(-1);
            const todayClosePrice = latestPriceObj?.close_price || 0;
            const date = latestPriceObj?.date || "";
            setCurrentDate(date);
            return todayClosePrice * item.quantity;
          })
        );
        const total = stockValues.reduce((acc, val) => acc + val, 0);
        setTotalValue(total);
      } catch (error) {
        console.error("Error calculating total stock value:", error);
        setTotalValue(0);
      }
    }

    fetchStockPricesAndCalculateTotal();
  }, [userStocks]);

  useEffect(() => {
    async function PortfolioValue() {
      const cacheKey = "userPortfolioData";
      const cacheTimestampKey = "portfolioDataSendTimestamp";

      const now = new Date();
      const currentHour = now.getHours();

      // Only run after 3 PM
      if (currentHour < 15) {
        return;
      }

      // currentDate should be in format YYYY-MM-DD, if not, format it
      const formattedCurrentDate = currentDate.length >= 10 ? currentDate.slice(0, 10) : "";

      const cachedData = localStorage.getItem(cacheKey);
      const cachedTimestamp = localStorage.getItem(cacheTimestampKey);

      if (cachedData && cachedTimestamp) {
        // If cached data is from today, do nothing
        if (cachedTimestamp === formattedCurrentDate) {
          console.log("Returning cached portfolio data:", JSON.parse(cachedData));
          return JSON.parse(cachedData);
        }
      }

      if (!totalValue || totalValue === 0 || !formattedCurrentDate) {
        return;
      }

      try {
        // Fetch today's portfolio entries
        const checkResponse = await fetch("http://127.0.0.1:8000/api/user/portfolio/", {
          method: "GET",
          headers: {
            Authorization: "Bearer " + authTokens?.access,
            "Content-Type": "application/json",
          },
        });

        if (!checkResponse.ok) {
          console.error("Failed to fetch today's portfolio data");
          return;
        }

        const todayData = await checkResponse.json();

        // Assuming todayData can be an array or object; adjust if needed
        if (
          todayData &&
          (Array.isArray(todayData)
            ? todayData.some((entry) => entry.portfolio_value_date === formattedCurrentDate)
            : todayData.portfolio_value_date === formattedCurrentDate)
        ) {
          console.log("Today's portfolio value already exists:", formattedCurrentDate);
          localStorage.setItem(cacheKey, JSON.stringify(todayData));
          localStorage.setItem(cacheTimestampKey, formattedCurrentDate);
          return;
        }

        // No duplicate, add portfolio data for today
        const response = await fetch("http://127.0.0.1:8000/api/user/portfolio/add/", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + authTokens?.access,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            portfolio_value_date: formattedCurrentDate,
            portfolio_value: totalValue,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error adding portfolio value:", errorData);
        } else {
          console.log("Added portfolio value successfully");
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              portfolio_value_date: formattedCurrentDate,
              portfolio_value: totalValue,
            })
          );
          localStorage.setItem(cacheTimestampKey, formattedCurrentDate);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    // Run PortfolioValue only if totalValue and currentDate are valid and avoid multiple calls using ref
    if (!hasSentRequest.current && totalValue > 0 && currentDate) {
      hasSentRequest.current = true;
      PortfolioValue();
    }
  }, [totalValue, currentDate, authTokens]);

  return null; // Assuming this component does not render anything visible
}

export default StorePortfolioValue;
