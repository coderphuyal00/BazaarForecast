import { createContext, useState, useEffect, useContext } from "react";
const StockDataContext = createContext();
import { useNavigate, useParams } from "react-router-dom";
import { redirect } from "react-router-dom";
export default StockDataContext;
import AuthContext from "./AuthContext";
export const StockDataProvider = ({ children }) => {
  // const redirect=redirect();
  const { authTokens, user } = useContext(AuthContext);
  const [searchedstockData, setsearchedstockData] = useState();
  const [userWatchlist, setuserWatchlist] = useState([]);
  const [userStocks, setuserStocks] = useState([]);
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
    const response = await fetch(`http://127.0.0.1:8000/api/stock/detail/${ticker}/1D/`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authTokens?.access,
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const apiData = await response.json();
    // console.log(apiData)
    if (apiData) {
      setsearchedstockData(apiData);

      return apiData;
    }
  };
  
  useEffect(() => {
    if (!user) {
    setuserStocks([]);
    setuserWatchlist([]);
    return;
  }
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
      // console.log(apiData)
      setuserStocks(apiData);
      return apiData;
    };
    UserStocks();
  }, [user]);

  useEffect(() => {
  const fetchUserWatchlist = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/user/watchlist/", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + authTokens?.access,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const apiData = await response.json();

      if (response.status === 200) {
        setuserWatchlist(apiData);
        // console.log(apiData)
      }
    } catch (error) {
      console.error("Failed to fetch user watchlist:", error);
    }
  };

  fetchUserWatchlist();
}, [user, authTokens]);

  const AddUserStocks = async () => {};
  let contextData = {
    fetchDataOncePerDay: fetchDataOncePerDay,
    fetchStocks: fetchStocks,
    searchedstockData: searchedstockData,
    UserStocks: userStocks,
    UserWatchlist: userWatchlist,
    AddUserStocks: AddUserStocks,
  };

  return (
    <StockDataContext.Provider value={contextData}>
      {children}
    </StockDataContext.Provider>
  );
};
