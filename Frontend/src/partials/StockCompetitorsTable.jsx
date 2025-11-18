import { useEffect, useState,useContext } from "react";
import { StockClosePrice, StockPriceDiff } from "./StockClosePrices";
import AuthContext from "../components/context/AuthContext";
function StockCompetitorsTable({
  currentTicker,
  stockCompetitors,
  currentTickerClosePrice,
  currentTickerYearHighPrice,
  currentTickerYearLowPrice,
  currentTickerPriceDiff,
  handleClick,
}) {
  const [todayClosePrice, setTodayClosePrice] = useState();
  const [priceDiff, setPriceDiff] = useState();
  const [isGain, setGain] = useState();
  const [stockData, setStockData] = useState([]);
  const [ticker, setTicker] = useState();
  const [stockSector, setStockSector] = useState();
  const [competitorsData, setCompetitorsData] = useState([]);
  const [fetchFunction, setfetchFunction] = useState();
  const {authTokens}=useContext(AuthContext)
  const fetchClosePrice = (ticker) => {
    fetch(`http://127.0.0.1:8000/api/stock/daily-price/${ticker}/`)
      .then((response) => response.json())
      .then((data) => {
        // Format data to chart.js structure: labels and data points
        // Assuming the API returns an array with date and price fields, e.g.:
        // [{ date: "2025-07-20", price: 1400 }, { date: "2025-07-21", price: 1420 }, ...]

        const close_prices = data.map((item) => item.close_price);
        let lastIndex = close_prices.length;
        let lastElement = close_prices[lastIndex - 1];
        setTodayClosePrice(lastElement);
        console.log(todayClosePrice);
        const diffPercentage = () => {
          let secondLastElement = close_prices[lastIndex - 2];
          // console.log(secondLastElement);
          let percentageDiff =
            ((lastElement - secondLastElement) / secondLastElement) * 100;
          if (lastElement > secondLastElement) {
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
      });
  };
  useEffect(() => {
    // Extract tickers from your array of objects
    const tickers = stockCompetitors?.map((item) => item.ticker);
    // console.log(tickers);
    const fetchStocks = async (ticker) => {
      // const navigate = useNavigate();
      // const {ticker}=useParams()
      // const inputTicker = e.target.search.value;
      const response = await fetch(
        `http://127.0.0.1:8000/api/stock/detail/${ticker}/1D/`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + authTokens?.access,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const apiData = await response.json();
      // console.log(apiData);
      if (apiData) {
        addStockData(apiData);

        return apiData;
      }
    };
    tickers?.map((ticker) => {
      fetchStocks(ticker);
      // fetchStockPrices(ticker);
    });
    // console.log(stockData);
  }, [stockCompetitors]);

  const addStockData = (newItem) => {
    setCompetitorsData((prevList) => [...prevList, newItem]);
  };

  return (
    <table className="table-auto w-full ">
      {/* Table header */}
      <thead className="text-xs uppercase text-gray-400 dark:text-gray-100 bg-gray-50 dark:bg-gray-700/50 rounded-xs">
        <tr>
          <th className="p-2">
            <div className="font-semibold text-left">Company Symbol</div>
          </th>
          <th className="p-2">
            <div className="font-semibold text-left">Company Name</div>
          </th>
          <th className="p-2">
            <div className="font-semibold text-center">Market Cap.</div>
          </th>
          <th className="p-2">
            <div className="font-semibold text-center">LTP</div>
          </th>
          <th className="p-2">
            <div className="font-semibold text-center">Day Change</div>
          </th>
          <th className="p-2">
            <div className="font-semibold text-center">
              Last Day Price Range
            </div>
          </th>
        </tr>
      </thead>
      {/* Table body */}
      <tbody className="text-sm text-gray-800 dark:text-gray-300 font-medium divide-y divide-gray-100 dark:divide-gray-700/60">
        {/* Row */}
        <tr className="border-b border-gray-500">
          <td className="p-2">
            <div className="flex items-center">
              <div className="text-gray-800 dark:text-gray-300 border-b border-gray-500 cursor-pointer">
                {currentTicker.ticker}
              </div>
            </div>
          </td>
          <td className="p-2">
            <div className="text-center">{currentTicker.name}</div>
          </td>
          <td className="p-2">
            <div className="text-center ">
              {currentTicker.market_cap != null
                ? Number.parseFloat(Number(currentTicker.market_cap).toFixed(4))
                : "-"}
            </div>
          </td>
          <td className="p-2">
            <div className="text-center">
              {" "}
              Rs.
              {currentTickerClosePrice != null
                ? Number.parseFloat(Number(currentTickerClosePrice).toFixed(4))
                : "-"}
            </div>
          </td>
          <td className="p-2">
            <div className="text-center">
              <StockPriceDiff
                TickerPrices={currentTicker.prices}
                displayLocation="competitors-table"
              />
            </div>
          </td>
          <td className="p-2">
            <div className="text-center">
              {currentTicker.prices.at(-1).low_price != null
                ? Number.parseFloat(
                    Number(currentTicker.prices.at(-1).low_price).toFixed(4)
                  )
                : "-"}{" "}
              -{" "}
              {currentTicker.prices.at(-1).low_price != null
                ? Number.parseFloat(
                    Number(currentTicker.prices.at(-1).high_price).toFixed(4)
                  )
                : "-"}
            </div>
          </td>
        </tr>
        {/* api fetched data */}
        {/* {stockCompetitors.map(item => <li key={item.id}>{item.id}</li>)} */}
        {competitorsData
          ?.filter((item1) => item1.id !== currentTicker.id)
          ?.map((item1) => (
            <tr key={item1.id}>
              <td className="p-2 pr-0">
                <div className="flex items-center">
                  <div className="text-gray-800 dark:text-gray-300 border-b border-gray-500 cursor-pointer">
                    <span onClick={() => handleClick(item1.ticker)}>
                      {item1.ticker}
                    </span>
                  </div>
                </div>
              </td>
              <td className="p-2 pl-1">
                <div className="text-center">{item1.name}</div>
              </td>
              <td className="p-2">
                <div className="text-center ">
                  {item1.market_cap != null
                    ? Number.parseFloat(Number(item1.market_cap).toFixed(4))
                    : "-"}
                </div>
              </td>
              <td className="p-2">
                <div className="text-center">
                  <StockClosePrice TickerPrice={item1.prices} />
                </div>
              </td>
              <td className="p-1">
                <div className="text-center dark:text-gray-300">
                  <StockPriceDiff
                    className="text-gray-800"
                    TickerPrices={item1.prices}
                    displayLocation="competitors-table"
                  />
                </div>
              </td>
              <td className="p-2">
                <div className="text-center ">
                  {item1.prices.at(-1).low_price != null
                    ? Number.parseFloat(
                        Number(item1.prices.at(-1).low_price).toFixed(4)
                      )
                    : "-"}{" "}
                  -{" "}
                  {item1.prices.at(-1).high_price != null
                    ? Number.parseFloat(
                        Number(item1.prices.at(-1).high_price).toFixed(4)
                      )
                    : "-"}
                </div>
              </td>
            </tr>
          ))}

        {/* Row */}
      </tbody>
    </table>
  );
}
export default StockCompetitorsTable;
