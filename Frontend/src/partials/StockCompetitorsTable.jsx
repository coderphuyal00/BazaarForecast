import { useEffect, useState } from "react";
import {StockClosePrice,StockPriceDiff} from "./StockClosePrices";
function StockCompetitorsTable({
  currentTicker,
  stockCompetitors,
  currentTickerClosePrice,
  currentTickerPriceDiff,
  handleClick,
}) {
  const [todayClosePrice, setTodayClosePrice] = useState();
  const [priceDiff, setPriceDiff] = useState();
  const [isGain, setGain] = useState();
  const [stockData, setStockData] = useState([]);
  const [ticker, setTicker] = useState();
  const [stockSector, setStockSector] = useState();
  const [fetchFunction, setfetchFunction] = useState();
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
  //   useEffect(() => {
  //     // Extract tickers from your array of objects
  //     const tickers = stockCompetitors.map((item) => item.stock.ticker);
  //     console.log(tickers)
  //     const fetchStockPrices = async (ticker) => {
  //     //   const close_prices = [];
  //       try {
  //         const response = await fetch(
  //           `http://127.0.0.1:8000/api/stock/1D/${ticker}/`
  //         );
  //         const data = await response.json();
  //         const close_prices=data.map((item) => item.close_price);
  //         let lastIndex = close_prices.length;
  //         let lastElement = close_prices[lastIndex - 1];
  //         // const addItem = (newItem) => {
  //         //   setStockData((prevstockData) => [...prevstockData, newItem]);
  //         // };
  //         // addItem(data); // 'data' property holds the stocks info
  //         console.log(data)
  //       } catch (error) {
  //         console.error("Error fetching stock data:", error);
  //       }
  //     };
  //     tickers.map((ticker) => {
  //       fetchStockPrices(ticker);
  //     });
  //     // console.log(stockData);
  //   }, [stockCompetitors]);

  

  //   useEffect(() => {
  //     const stockCompetitors = async (sector) => {
  //       let response = await fetch(
  //         `http://127.0.0.1:8000/api/stocks/category/${sector}/`
  //       );
  //       let apiData = await response.json();
  //     //   setStockCompetitors(apiData);
  //     let tickers=apiData.map((item)=>item.stock.ticker)
  //     tickers.forEach(ticker=>{
  //         fetchStockPrices(ticker)
  //     })
  //       console.log(apiData);
  //     };
  //     stockCompetitors(stockSector);
  //   }, [stockSector]);
  //   useEffect(() => {
  //     // searchedstockData?.map((item) => (
  //     //   setStockSector(item.stock.sector)
  //     // ))
  //     if (stockCompetitors?.length > 0) {
  //       setStockSector(currentTicker.stock.sector);
  //     }
  //   }, [stockCompetitors]);
  //   setfetchFunction(fetchClosePrice(ticker));
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
            <div className="font-semibold text-center">Price</div>
          </th>
          <th className="p-2">
            <div className="font-semibold text-center">Day Change</div>
          </th>
          <th className="p-2">
            <div className="font-semibold text-center">
              52 Weeks Price Range
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
                {currentTicker.stock.ticker}
              </div>
            </div>
          </td>
          <td className="p-2">
            <div className="text-center">{currentTicker.stock.name}</div>
          </td>
          <td className="p-2">
            <div className="text-center ">
              {currentTicker.stock.market_cap != null
                ? Number.parseFloat(
                    Number(currentTicker.stock.market_cap).toFixed(4)
                  )
                : "-"}
            </div>
          </td>
          <td className="p-2">
            <div className="text-center"> Rs.
              {currentTickerClosePrice != null
                ? Number.parseFloat(Number(currentTickerClosePrice).toFixed(4))
                : "-"}
            </div>
          </td>
          <td className="p-2">
            <div className="text-center"><StockPriceDiff TickerPrices={currentTicker.stock.ticker} displayLocation='competitors-table'/></div>
          </td>
          <td className="p-2">
            <div className="text-center">
              {currentTicker.low_price_52_week != null
                ? Number.parseFloat(
                    Number(currentTicker.low_price_52_week).toFixed(4)
                  )
                : "-"}{" "}
              -{" "}
              {currentTicker.high_price_52_week != null
                ? Number.parseFloat(
                    Number(currentTicker.high_price_52_week).toFixed(4)
                  )
                : "-"}
            </div>
          </td>
        </tr>
        {/* api fetched data */}
        {/* {stockCompetitors.map(item => <li key={item.id}>{item.id}</li>)} */}
        {stockCompetitors
          .filter((item1) => item1.id !== currentTicker.id)
          .map((item1) => (
            <tr key={item1.id}>
              <td className="p-2 pr-0">
                <div className="flex items-center">
                  <div className="text-gray-800 dark:text-gray-300 border-b border-gray-500 cursor-pointer">
                    <span onClick={() => handleClick(item1.stock.ticker)}>
                      {item1.stock.ticker}
                    </span>
                  </div>
                </div>
              </td>
              <td className="p-2 pl-1">
                <div className="text-center">{item1.stock.name}</div>
              </td>
              <td className="p-2">
                <div className="text-center ">
                  {item1.stock.market_cap != null
                    ? Number.parseFloat(
                        Number(item1.stock.market_cap).toFixed(4)
                      )
                    : "-"}
                </div>
              </td>
              <td className="p-2">
                <div className="text-center">
                  <StockClosePrice TickerPrice={item1.stock.ticker}/>
                </div>
              </td>
              <td className="p-1">
                <div className="text-center dark:text-gray-300"><StockPriceDiff className="text-gray-800" TickerPrices={item1.stock.ticker} displayLocation='competitors-table'/></div>
              </td>
              <td className="p-2">
                <div className="text-center ">
                  {item1.low_price_52_week != null
                    ? Number.parseFloat(
                        Number(item1.low_price_52_week).toFixed(4)
                      )
                    : "-"}{" "}
                  -{" "}
                  {item1.high_price_52_week != null
                    ? Number.parseFloat(
                        Number(item1.high_price_52_week).toFixed(4)
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
