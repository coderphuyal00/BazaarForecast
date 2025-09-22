import { createContext, useState, useEffect, useContext } from "react";
const StockDataContext = createContext();
import { useNavigate,useParams } from "react-router-dom";
import { redirect } from "react-router-dom";
export default StockDataContext;
import AuthContext from "./AuthContext";
export const StockDataProvider = ({ children }) => {
  // const redirect=redirect();
  const { authTokens } = useContext(AuthContext);
  const [searchedstockData,setsearchedstockData]=useState();
  const fetchDataOncePerDay = async (data) => {
    const cacheKey = "nepseChartData";
    const cacheTimestampKey = "nepseChartDataTimestamp";
    
    const cachedData = localStorage.getItem(cacheKey);
    
    const cachedTimestamp = localStorage.getItem(cacheTimestampKey);

    const now = new Date();

    if (cachedData && cachedTimestamp) {
      const cachedDate = new Date(cachedTimestamp);
      const diffInDays = (now - cachedDate) / (1000 * 60 * 60 * 24);

      if (diffInDays < 1) {
        return JSON.parse(cachedData);
      }
    }

    // Fetch new data from API
    const response = await fetch(data);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const apiData = await response.json();

    // Save to localStorage with current timestamp
    localStorage.setItem(cacheKey, JSON.stringify(apiData));
    localStorage.setItem(cacheTimestampKey, now.toISOString());

    return apiData;
  };
  const fetchStocks = async (ticker) => {
    // const navigate = useNavigate();
    // const {ticker}=useParams()
    // const inputTicker = e.target.search.value;
    const response = await fetch(`http://127.0.0.1:8000/api/stock/${ticker}/`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authTokens?.access,
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const apiData = await response.json();
    if (apiData) {
      
        setsearchedstockData(apiData)

      
      return apiData;
    }
  };
  const UserStocks = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/user/stocks/", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authTokens?.access,
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const apiData = await response.json();
    return apiData;
  };
  const AddUserStocks = async () => {


  };
  let contextData = {
    fetchDataOncePerDay: fetchDataOncePerDay,
    fetchStocks: fetchStocks,
    searchedstockData:searchedstockData,
    UserStocks: UserStocks,
    AddUserStocks: AddUserStocks,
  };

  return (
    <StockDataContext.Provider value={contextData}>
      {children}
    </StockDataContext.Provider>
  );
};
