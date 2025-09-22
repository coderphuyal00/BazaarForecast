import { useState, useEffect, useContext } from "react";
import IndexCard from "../partials/dashboard/IndexCard";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";
import SearchBox from "../components/ui/search";
import RealTimeChart from "../charts/RealtimeChart";
import LineChart from "../charts/LineChart";
import { chartAreaGradient } from "../charts/ChartjsConfig";
import { getCssVariable, adjustColorOpacity } from "../utils/Utils";
import { AngleUpIcon, AngleDownIcon } from "../icons";
import StockDataContext from "../components/context/StockDataContext";
import { se } from "date-fns/locale";
import { useParams, useNavigate } from "react-router-dom";
import { formatThousands, formatIndianNumber } from "../utils/Utils";
import StockPriceSignal from "../partials/StockPriceSignal ";
import StockCompetitorsTable from "../partials/StockCompetitorsTable";

function StockDetails() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [apiData, setapiData] = useState();
  const [todayDate, settodayDate] = useState();
  const [chartData, setChartData] = useState(null);
  const [stockCompetitors, setStockCompetitors] = useState(null);
  const [stockSector, setStockSector] = useState();
  const [todayClosePrice, setTodayClosePrice] = useState();
  const [todayHighPrice, setTodayHighPrice] = useState();
  const [todayLowPrice, setTodayLowPrice] = useState();
  const [todayVolume, setTodayVolume] = useState();
  const [priceDiff, setPriceDiff] = useState();
  const [pricePointDiff, setPricePointDiff] = useState();
  const [isGain, setGain] = useState();
  const [latestDate, setLatestDate] = useState();
  const [time, setTime] = useState();
  const { searchedstockData, fetchStocks } = useContext(StockDataContext);
  const { ticker } = useParams();
  useEffect(() => {
    const fetchStockPrice = (ticker) => {
      fetch(`http://127.0.0.1:8000/api/stock/1D/${ticker}/`)
        .then((response) => response.json())
        .then((data) => {
          // Format data to chart.js structure: labels and data points
          // Assuming the API returns an array with date and price fields, e.g.:
          // [{ date: "2025-07-20", price: 1400 }, { date: "2025-07-21", price: 1420 }, ...]
          const labels = data.map((item) => item.date);
          const close_prices = data.map((item) => item.close_price);
          const high_prices = data.map((item) => item.high_price);
          const low_prices = data.map((item) => item.low_price);
          const volume = data.map((item) => item.volume);
          // const latestPrice=prices.pop()
          let lastIndex = close_prices.length;
          let lastElement = close_prices[lastIndex - 1];
          let lastDate = labels[lastIndex - 1];
          const date = new Date(lastDate);
          setLatestDate(
            date
              .toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: undefined,
              })
              .replace(/\//g, ",")
          );
          setTodayClosePrice(lastElement);
          setTodayHighPrice(high_prices[lastIndex - 1]);
          setTodayLowPrice(low_prices[lastIndex - 1]);
          setTodayVolume(volume[lastIndex - 1]);
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
          const diffPoint = () => {
            let secondLastElement = close_prices[lastIndex - 2];
            // console.log(secondLastElement);
            let pointDiff = lastElement - secondLastElement;
            if (lastElement > secondLastElement) {
              setGain(true);
            } else {
              setGain(false);
            }
            function truncateDecimals(num, digits) {
              const multiplier = Math.pow(10, digits);
              return ~~(num * multiplier) / multiplier;
            }
            return truncateDecimals(pointDiff, 2);
          };
          setPricePointDiff(diffPoint());

          setChartData({
            labels,
            datasets: [
              {
                label: "NEPSE Index Price",
                data: close_prices,
                fill: false,
                backgroundColor: function (context) {
                  const chart = context.chart;
                  const { ctx, chartArea } = chart;
                  return chartAreaGradient(ctx, chartArea, [
                    {
                      stop: 0,
                      color: adjustColorOpacity(
                        getCssVariable("--color-violet-500"),
                        0
                      ),
                    },
                    {
                      stop: 1,
                      color: adjustColorOpacity(
                        getCssVariable("--color-violet-500"),
                        0.2
                      ),
                    },
                  ]);
                },
                borderColor: getCssVariable("--color-violet-500"),
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 3,
                pointBackgroundColor: getCssVariable("--color-violet-500"),
                pointHoverBackgroundColor: getCssVariable("--color-violet-500"),
                pointBorderWidth: 2,
                pointHoverBorderWidth: 0,
                clip: 10,
                tension: 0.2,
              },
            ],
          });
        });
    };
    fetchStockPrice(ticker);
  }, [ticker]);
  useEffect(() => {
    const stockCompetitors = async (sector) => {
      let response = await fetch(
        `http://127.0.0.1:8000/api/stocks/category/${sector}/`
      );
      let apiData = await response.json();
      setStockCompetitors(apiData);
      console.log(apiData);
    };
    stockCompetitors(stockSector);
  }, [stockSector]);
  useEffect(() => {
    // searchedstockData?.map((item) => (
    //   setStockSector(item.stock.sector)
    // ))
    if (searchedstockData?.length > 0) {
      setStockSector(searchedstockData[0].stock.sector);
    }
  }, [searchedstockData]);
  useEffect(() => {
    if (!ticker) return;

    const fetchData = async () => {
      // setLoading(true);
      // setError(null);
      try {
        await fetchStocks(ticker.toUpperCase());
      } catch (err) {
        // setError("Failed to fetch stock data.");
      } finally {
        // setLoading(false);
      }
    };

    fetchData();
  }, [ticker, fetchStocks]);

  const handleClick = (ticker) => {
    navigate(`/stock/${ticker}`);
    window.location.reload();
  };
  function classifyMarketCap(marketCap) {
    // marketCap is expected to be a number representing dollars

    if (marketCap > 200_000_000_000) {
      return "mega-capitalization"; // > $200B
    } else if (marketCap >= 10_000_000_000 && marketCap <= 200_000_000_000) {
      return "large-capitalization"; // $10B - $200B
    } else if (marketCap >= 2_000_000_000 && marketCap < 10_000_000_000) {
      return "mid-capitalization"; // $2B - $10B
    } else if (marketCap >= 300_000_000 && marketCap < 2_000_000_000) {
      return "small-capitalization"; // $300M - $2B
    } else if (marketCap < 300_000_000) {
      return "micro-capitalization"; // < $300M
    } else {
      return "unknown";
    }
  }
  function getIndianPlaceValue(num) {
    const placeValues = [
        "ones",          // 1st digit from right
        "tens",          // 2nd digit
        "hundreds",      // 3rd digit
        "thousands",     // 4th digit
        "ten thousands", // 5th digit
        "lakhs",         // 6th digit
        "ten lakhs",     // 7th digit
        "crores",        // 8th digit
        "ten crores",     // 9th digit
        "arab",     // 9th digit
        "ten arab",     // 9th digit
        "kharab",     // 9th digit
        // Extend if needed for larger numbers
    ];

    num = Math.abs(Number(num)); // ensure number and positive
    // if (!Number.isInteger(num)) return "Input must be an integer";

    let strNum = num.toString();
    let length = strNum.length;

    if (length > placeValues.length) {
        return "Number too large for this place value system";
    }

    // Index from right, so place value index = (length - 1)
    return placeValues[length - 1];
}

  
  function classifyMarketCapPlace(marketCap, ticker) {
    let market_cap = classifyMarketCap(Number.parseFloat(Number(marketCap).toFixed(4)))
    return (
      <span>
        A market capitalization of {ticker} is above {getIndianPlaceValue(Number.parseFloat(Number(marketCap).toFixed()))} places and falls on {" "}
        <strong className="text-gray-800 dark:text-gray-100 dark:font-bold">
          {market_cap}
        </strong>{" "}
        category.
      </span>
    );
  }
  useEffect(() => {
    const d = new Date();
    let hour = d.getHours();
    setTime(hour);
  }, []);
  // const data =apiData
  useEffect(() => {
    const date = new Date();
    settodayDate(date.toDateString());
    // setChartData({
    //   labels: [
    //     "12-01-2022",
    //     "01-01-2023",
    //     "02-01-2023",
    //     "03-01-2023",
    //     "04-01-2023",
    //     "05-01-2023",
    //     "06-01-2023",
    //     "07-01-2023",
    //     "08-01-2023",
    //     "09-01-2023",
    //     "10-01-2023",
    //     "11-01-2023",
    //     "12-01-2023",
    //     "01-01-2024",
    //     "02-01-2024",
    //     "03-01-2024",
    //     "04-01-2024",
    //     "05-01-2024",
    //     "06-01-2024",
    //     "07-01-2024",
    //     "08-01-2024",
    //     "09-01-2024",
    //     "10-01-2024",
    //     "11-01-2024",
    //     "12-01-2024",
    //     "01-01-2025",
    //   ],
    //   datasets: [
    //     {
    //       label: "NEPSE Index Price",
    //       data: [
    //         540, 466, 540, 466, 385, 432, 334, 334, 289, 289, 200, 289, 222,
    //         289, 289, 403, 554, 304, 289, 270, 134, 270, 829, 344, 388, 364,
    //       ],
    //       fill: true,
    //       backgroundColor: function (context) {
    //         const chart = context.chart;
    //         const { ctx, chartArea } = chart;
    //         return chartAreaGradient(ctx, chartArea, [
    //           {
    //             stop: 0,
    //             color: adjustColorOpacity(
    //               getCssVariable("--color-violet-500"),
    //               0
    //             ),
    //           },
    //           {
    //             stop: 1,
    //             color: adjustColorOpacity(
    //               getCssVariable("--color-violet-500"),
    //               0.2
    //             ),
    //           },
    //         ]);
    //       },
    //       borderColor: getCssVariable("--color-violet-500"),
    //       borderWidth: 2,
    //       pointRadius: 0,
    //       pointHoverRadius: 3,
    //       pointBackgroundColor: getCssVariable("--color-violet-500"),
    //       pointHoverBackgroundColor: getCssVariable("--color-violet-500"),
    //       pointBorderWidth: 0,
    //       pointHoverBorderWidth: 0,
    //       clip: 20,
    //       tension: 0.2,
    //     },
    //   ],
    // });
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          {/* <p>{searchedstockData.id}</p> */}
          {searchedstockData?.map((item) => (
            <div key={item.id}>
              {/* {setStockSector(item.sector)} */}

              <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                {/* Dashboard actions */}
                <div className="index-data flex mb-3 ">
                  {/* Index Data */}
                  <div className="max-w-(--breakpoint-2xl) md:p-0">
                    <div className="grid grid-cols-12 gap-4 md:gap-6">
                      <div className="col-span-10">
                        <div className="col-span-full gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
                          <IndexCard />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="max-w-(--breakpoint-2xl) md:p-0">
                    <div className="grid grid-cols-12 gap-4 md:gap-6">
                      <div className="col-span-10">
                        <div className="col-span-full gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
                          <IndexCard />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="max-w-(--breakpoint-2xl) md:p-0">
                    <div className="grid grid-cols-12 gap-4 md:gap-6">
                      <div className="col-span-10">
                        <div className="col-span-full gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
                          <IndexCard />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-b border-gray-200 dark:border-gray-700/60 z-999"></div>
                <div className="sm:flex sm:justify-between sm:items-center mb-8">
                  {/* Left: Title */}
                  <div className="mb-4 sm:mb-0">
                    <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                      {item.stock.name}
                    </h1>
                    <p className="text-xl md:text-xl text-gray-800 dark:text-gray-100 font-bold">
                      {item.stock.ticker}
                    </p>
                  </div>
                  <div className="mb-4 sm:mb-0">
                    <SearchBox placeholder="Search Symbols or Companies" />
                  </div>

                  {/* Right: Actions */}
                </div>

                {/* Latest Price Data and Chart */}
                <div className="mb-8 grow flex flex-col grid col-span-full sm:col-span-12 xl:col-span-12 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
                  <div className="grid grid-cols-12 gap-2 ">
                    <div className="stock-price-chart col-span-9 flex flex-col">
                      <div className="daily-data flex flex-col pr-3 p-8">
                        <div className="flex justify-between flex-row">
                          <div className="flex flex-row">
                            <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">
                              NPR{" "}
                              {todayClosePrice != null
                                ? Number.parseFloat(
                                    Number(todayClosePrice).toFixed(4)
                                  )
                                : "-"}
                            </div>
                            <div className="flex flex-row items-start">
                              {isGain ? (
                                <div className="text-sm font-bold text-green-700 mt-2 px-1.5 bg-green-500/20 rounded-full">
                                  +{pricePointDiff}
                                </div>
                              ) : (
                                <div className="text-sm font-bold text-red-700 mt-2 px-1.5 bg-red-500/20 rounded-full">
                                  {pricePointDiff}
                                </div>
                              )}
                              {isGain ? (
                                <div className="flex items-center text-green-700 m-2">
                                  <div className="text-sm font-bold">
                                    {priceDiff} %
                                  </div>
                                  <div className="font-bold">
                                    <AngleUpIcon className="h-4 w-4" />
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center text-red-700 m-2">
                                  <div className="text-sm font-bold">
                                    {priceDiff} %
                                  </div>
                                  <div className="font-bold">
                                    <AngleDownIcon className="h-4 w-4" />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <div className="text-sm font-normal text-gray-800 dark:text-gray-100 mr-2">
                              Trade Day Range
                            </div>
                            <div className="text-lg font-bold text-gray-700 mt-2 px-1.5">
                              {todayLowPrice != null
                                ? Number.parseFloat(
                                    Number(todayLowPrice).toFixed(4)
                                  )
                                : "-"}{" "}
                              -{" "}
                              {todayHighPrice != null
                                ? Number.parseFloat(
                                    Number(todayHighPrice).toFixed(4)
                                  )
                                : "-"}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <div className="text-sm font-normal text-gray-800 dark:text-gray-100 mr-2">
                              Volume
                            </div>
                            <div className="text-lg font-bold text-gray-700 mt-2">
                              {todayVolume}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <div className="text-sm font-normal text-gray-800 dark:text-gray-100 mr-2">
                              52 Weeks Range
                            </div>
                            <div className="text-lg font-bold text-gray-700 mt-2">
                              {item.low_price_52_week != null
                                ? Number.parseFloat(
                                    Number(item.low_price_52_week).toFixed(4)
                                  )
                                : "-"}{" "}
                              -{" "}
                              {item.high_price_52_week != null
                                ? Number.parseFloat(
                                    Number(item.high_price_52_week).toFixed(4)
                                  )
                                : "-"}
                            </div>
                          </div>
                        </div>
                        {time < 11 && time > 15 ? (
                          <div className="font-medium ">Price at close</div>
                        ) : (
                          <div className="font-medium ">Current Price</div>
                        )}
                        {/* Current date */}
                        <div className="">
                          <span className="text-xs font-bold text-gray-800">
                            {todayDate}
                          </span>
                        </div>
                      </div>
                      <div className="chart grow">
                        <div className="grow pb-0 mb-0 h-full max-h-96">
                          {/* Change the height attribute to adjust the chart height */}
                          {chartData ? (
                            <LineChart
                              data={chartData}
                              width={595}
                              height={245}
                            />
                          ) : (
                            <p>Loading chart...</p>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Insights */}
                    <div className="col-span-3 pt-8 pr-2">
                      <div className="flex-1 text-md font-semibold text-gray-800 dark:text-gray-100 mr-2 mb-3">
                        <div className=" text-center p-2 bg-violet-500/25 rounded-full">
                          <span>Insights</span>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="price-momentum mb-3">
                          <h3 className="font-semibold text-gray-800 dark:text-gray-100 dark:font-bold">
                            Price Momentum
                          </h3>
                          <span className="font-normal dark:text-gray-100 dark:font-bold">
                            {item.stock.ticker} is trading{" "}
                            <strong>
                              <StockPriceSignal
                                todayPrice={todayClosePrice}
                                low52Week={item.low_price_52_week}
                                high52Week={item.high_price_52_week}
                                thresholdPercent={2}
                              />
                            </strong>{" "}
                            of its 52-week range .
                          </span>
                        </div>
                        <div className="price-change mb-3">
                          <h3 className="font-semibold text-gray-800 dark:text-gray-100 dark:font-bold">
                            Price Change
                          </h3>
                          <span className="font-normal">
                            The price of {item.stock.ticker} shares has{" "}
                            {isGain ? (
                              <strong className="text-green-700">
                                {" "}
                                increased Rs. {pricePointDiff}{" "}
                              </strong>
                            ) : (
                              <strong className="text-red-700">
                                decreased Rs. {pricePointDiff}{" "}
                              </strong>
                            )}
                            since the market last closed. This is a{" "}
                            {isGain ? (
                              <strong className="text-green-700">
                                {" "}
                                {priceDiff} % gain.
                              </strong>
                            ) : (
                              <strong className="text-red-700">
                                {" "}
                                {priceDiff} % drop.
                              </strong>
                            )}
                          </span>
                        </div>
                        <div className="close-price mb-3">
                          <h3 className="font-semibold text-gray-800 dark:text-gray-100 dark:font-bold">
                            Closed at Rs.{" "}
                            {todayClosePrice != null
                              ? Number.parseFloat(
                                  Number(todayClosePrice).toFixed(4)
                                )
                              : "-"}
                          </h3>
                          <span className="font-normal">
                            The stock has since{" "}
                            {isGain ? (
                              <strong className="text-green-700">
                                {" "}
                                gained Rs. {pricePointDiff}{" "}
                              </strong>
                            ) : (
                              <strong className="text-red-700">
                                dropped Rs. {pricePointDiff}{" "}
                              </strong>
                            )}
                            in after-hours trading.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Fundamental Data */}
                <div className="mb-8 grid grid-cols-12 gap-2 justify-between bg-white dark:bg-gray-800 shadow-xs rounded-xl">
                  {/* About Stock  */}
                  <div className="grid-flow-col auto-cols-auto col-span-8 p-8">
                    {/* <div className="border-b border-gray-200 dark:border-gray-700/60 z-999"></div> */}
                    {/* fundamental data headers and values */}
                    <div className="text-xl font-bold text-gray-800 dark:text-gray-100 mr-2 mb-2">
                      About {item.stock.ticker}
                    </div>
                    <div className="col-span-10">
                      <span className="font-semibold text-base text-violet-300">
                        Key stock statistics
                      </span>
                    </div>
                    <div className="grid col-span-full  grid-flow-col gap-2 mt-3">
                      {/* left */}
                      <div className="pr-2 col-span-2 dark:text-white text-[15px]">
                        {/* Sector */}
                        <div className="flex mb-4 justify-between">
                          {/* Header */}
                          <div className="">Sector</div>
                          {/* Value */}
                          <div className="font-bold text-gray-600 dark:text-gray-300">
                            {item.stock.sector}
                          </div>
                        </div>
                        <div className="flex mb-4 justify-between">
                          {/* Header */}
                          <div className="">Listed Share</div>
                          {/* Value */}
                          <div className="font-bold text-gray-600 dark:text-gray-300">
                            {item.stock.listed_share}
                          </div>
                        </div>
                        <div className="flex mb-4 justify-between">
                          {/* Header */}
                          <div className="">Market Capitalization</div>
                          {/* Value */}
                          <div className="font-bold text-gray-600 dark:text-gray-300">
                            {item.stock.market_cap != null
                              ? Number.parseFloat(
                                  Number(item.stock.market_cap).toFixed(4)
                                )
                              : "-"}
                          </div>
                        </div>
                        <div className="flex mb-4 justify-between">
                          {/* Header */}
                          <div className="">Earning Per Share</div>
                          {/* Value */}
                          <div className="font-bold text-gray-600 dark:text-gray-300">
                            {item.stock.eps}
                          </div>
                        </div>
                      </div>
                      {/* right */}
                      <div className="pr-2 col-span-4 dark:text-white text-[15px]">
                        <div className="flex mb-4 justify-between">
                          {/* Header */}
                          <div className="">PE Ratio</div>
                          {/* Value */}
                          <div className="font-bold text-gray-600 dark:text-gray-300">
                            {item.stock.pe_ratio}
                          </div>
                        </div>
                        <div className="flex mb-4 justify-between">
                          {/* Header */}
                          <div className="">Book Valve Per Share</div>
                          {/* Value */}
                          <div className="font-bold text-gray-600 dark:text-gray-300">
                            {item.stock.bvps != null
                              ? Number.parseFloat(
                                  Number(item.stock.bvps).toFixed(4)
                                )
                              : "-"}
                          </div>
                        </div>
                        <div className="flex mb-4 justify-between">
                          {/* Header */}
                          <div className="">Paid Capital</div>
                          {/* Value */}
                          <div className="font-bold text-gray-600 dark:text-gray-300">
                            {item.stock.paid_capital != null
                              ? Number.parseFloat(
                                  Number(item.stock.paid_capital).toFixed(4)
                                )
                              : "-"}
                          </div>
                        </div>
                        <div className="flex mb-4 justify-between">
                          {/* Header */}
                          <div className="">Year Yield</div>
                          {/* Value */}
                          <div className="font-bold text-gray-600 dark:text-gray-300">
                            {item.stock.year_yield} %
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Insights */}
                  <div className="col-span-4 pl-4 p-8 ">
                    <div className="flex-1 text-md font-semibold text-gray-800 dark:text-gray-100 mr-2 mb-2">
                      <div className=" text-center p-2 bg-violet-500/25 rounded-full">
                        <span>Insights</span>
                      </div>
                    </div>
                    <div className="">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                        Market cap: Rs.{" "}
                        {formatIndianNumber(item.stock.market_cap)}
                      </h3>
                      <div className="font-normal dark:text-gray-100">
                        {classifyMarketCapPlace(
                          item.stock.market_cap,
                          item.stock.ticker
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Stock Competitors */}
                <div className="mb-8 grid grid-cols-12 gap-2 justify-between bg-white text-gray-800 dark:bg-gray-800 shadow-xs rounded-xl">
                  {/* Stock Competitors Title */}

                  {/* Stock Competitors Table */}
                  <div className="col-span-9 p-8 pr-2 ">
                    <div className="pb-3 text-xl col-span-8 font-bold text-gray-800 dark:text-gray-100 mr-2 mb-2">
                      {item.stock.ticker} Competitors
                    </div>
                    {/* Table */}
                    {item != null ? (
                      <StockCompetitorsTable
                        currentTicker={item}
                        currentTickerPriceDiff={priceDiff}
                        currentTickerClosePrice={todayClosePrice}
                        stockCompetitors={stockCompetitors}
                        handleClick={handleClick}
                        className="text-gray-800"
                      />
                    ) : (
                      "Loading.."
                    )}
                  </div>

                  {/* Insights */}
                  <div className="col-span-3 pl-2 pr-3 p-8 ">
                    <div className="flex-1 text-md font-semibold text-gray-800 dark:text-gray-100 mr-2 mb-4">
                      <div className=" text-center p-2 bg-violet-500/25 rounded-full">
                        <span>Insights</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                        How competitors are chosen ?
                      </h3>
                      <span className="font-normal dark:text-gray-300">
                        {item.stock.ticker}'s competitors are included in the same sector ({" "}
                        {item.stock.sector}{" "}).
                      </span>
                    </div>
                    <div className="dark:text-gray-100">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                        Market cap: Rs.{" "}
                        {formatIndianNumber(item.stock.market_cap)}
                      </h3>
                      <div className="dark:text-gray-300">
                        {classifyMarketCapPlace(
                          item.stock.market_cap,
                          item.stock.ticker
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </main>

        {/* <Banner />s */}
      </div>
    </div>
  );
}
export default StockDetails;
