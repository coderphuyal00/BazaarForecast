import { useState, useEffect, useContext, useRef } from "react";
import IndexCard from "../partials/dashboard/IndexCard";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";
import SearchBox from "../components/ui/search";
import Loader from "../components/ui/spinner";
import RealTimeChart from "../charts/RealtimeChart";
import LineChart from "../charts/LineChart";
import { Spinner } from "@material-tailwind/react";
import { chartAreaGradient } from "../charts/ChartjsConfig";
import { getCssVariable, adjustColorOpacity } from "../utils/Utils";
import { AngleUpIcon, AngleDownIcon } from "../icons";
import StockDataContext from "../components/context/StockDataContext";
import { useAuth } from "../components/context/AuthContext";
import { se } from "date-fns/locale";
import { useParams, useNavigate } from "react-router-dom";
import { formatThousands, formatIndianNumber } from "../utils/Utils";
import StockPriceSignal from "../partials/StockPriceSignal ";
import StockCompetitorsTable from "../partials/StockCompetitorsTable";
import StockChartWithResolution from "../partials/ResolutionWiseStockData";
import InfiniteScroll from "../partials/InfiniteScroll";

function StockDetails() {
  const navigate = useNavigate();
  const { authTokens, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [apiData, setapiData] = useState();
  const [todayDate, settodayDate] = useState();
  const [chartData, setChartData] = useState(null);
  const [stockCompetitors, setStockCompetitors] = useState(null);
  const [stockSector, setStockSector] = useState();
  const [todayClosePrice, setTodayClosePrice] = useState();
  const [todayHighPrice, setTodayHighPrice] = useState();
  const [yearHighPrice, setyearHighPrice] = useState();
  const [yearLowPrice, setyearLowPrice] = useState();
  const [todayLowPrice, setTodayLowPrice] = useState();
  const [todayVolume, setTodayVolume] = useState();
  const [priceDiff, setPriceDiff] = useState();
  const [searchedstockData, setsearchedstockData] = useState();
  const [pricePointDiff, setPricePointDiff] = useState();
  const [isGain, setGain] = useState();
  const [isEqual, setEqual] = useState();
  const [labels, setLabels] = useState([]);
  const [closePrices, setClosePrices] = useState([]);
  const [latestDate, setLatestDate] = useState();
  const [time, setTime] = useState();
  const [prediction, setPrediction] = useState(null);
  const pollInterval = useRef(null);

  // new
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const { searchedstockData, fetchStocks } = useContext(StockDataContext);
  const { ticker } = useParams();
  // useEffect(() => {
  //   const fetchStockPrice = (ticker) => {
  //     fetch(`http://127.0.0.1:8000/api/stock/1D/${ticker}/`)
  //       .then((response) => response.json())
  //       .then((data) => {
  //         // Format data to chart.js structure: labels and data points
  //         // Assuming the API returns an array with date and price fields, e.g.:
  //         // [{ date: "2025-07-20", price: 1400 }, { date: "2025-07-21", price: 1420 }, ...]
  //         const labels = data.map(
  //           (searchedstockData) => searchedstockData.date
  //         );
  //         const close_prices = data.map(
  //           (searchedstockData) => searchedstockData.close_price
  //         );
  //         const high_prices = data.map(
  //           (searchedstockData) => searchedstockData.high_price
  //         );
  //         const low_prices = data.map(
  //           (searchedstockData) => searchedstockData.low_price
  //         );
  //         const volume = data.map(
  //           (searchedstockData) => searchedstockData.volume
  //         );
  //         // const latestPrice=prices.pop()
  //         let lastIndex = close_prices.length;
  //         let lastElement = close_prices[lastIndex - 1];
  //         let lastDate = labels[lastIndex - 1];
  //         const date = new Date(lastDate);
  //         setLatestDate(
  //           date
  //             .toLocaleDateString("en-US", {
  //               month: "long",
  //               day: "numeric",
  //               year: undefined,
  //             })
  //             .replace(/\//g, ",")
  //         );
  //         setTodayClosePrice(lastElement);
  //         setTodayHighPrice(high_prices[lastIndex - 1]);
  //         setTodayLowPrice(low_prices[lastIndex - 1]);
  //         setTodayVolume(volume[lastIndex - 1]);
  //         const diffPercentage = () => {
  //           let secondLastElement = close_prices[lastIndex - 2];
  //           // console.log(secondLastElement);
  //           let percentageDiff =
  //             ((lastElement - secondLastElement) / secondLastElement) * 100;
  //           if (lastElement > secondLastElement) {
  //             setGain(true);
  //           } else {
  //             setGain(false);
  //           }
  //           function truncateDecimals(num, digits) {
  //             const multiplier = Math.pow(10, digits);
  //             return ~~(num * multiplier) / multiplier;
  //           }
  //           return truncateDecimals(percentageDiff, 2);
  //         };
  //         setPriceDiff(diffPercentage());
  //         const diffPoint = () => {
  //           let secondLastElement = close_prices[lastIndex - 2];
  //           // console.log(secondLastElement);
  //           let pointDiff = lastElement - secondLastElement;
  //           if (lastElement > secondLastElement) {
  //             setGain(true);
  //           } else {
  //             setGain(false);
  //           }
  //           function truncateDecimals(num, digits) {
  //             const multiplier = Math.pow(10, digits);
  //             return ~~(num * multiplier) / multiplier;
  //           }
  //           return truncateDecimals(pointDiff, 2);
  //         };
  //         setPricePointDiff(diffPoint());

  //         setChartData({
  //           labels,
  //           datasets: [
  //             {
  //               label: "NEPSE Index Price",
  //               data: close_prices,
  //               fill: false,
  //               backgroundColor: function (context) {
  //                 const chart = context.chart;
  //                 const { ctx, chartArea } = chart;
  //                 return chartAreaGradient(ctx, chartArea, [
  //                   {
  //                     stop: 0,
  //                     color: adjustColorOpacity(
  //                       getCssVariable("--color-violet-500"),
  //                       0
  //                     ),
  //                   },
  //                   {
  //                     stop: 1,
  //                     color: adjustColorOpacity(
  //                       getCssVariable("--color-violet-500"),
  //                       0.2
  //                     ),
  //                   },
  //                 ]);
  //               },
  //               borderColor: getCssVariable("--color-violet-500"),
  //               borderWidth: 2,
  //               pointRadius: 0,
  //               pointHoverRadius: 3,
  //               pointBackgroundColor: getCssVariable("--color-violet-500"),
  //               pointHoverBackgroundColor: getCssVariable("--color-violet-500"),
  //               pointBorderWidth: 2,
  //               pointHoverBorderWidth: 0,
  //               clip: 10,
  //               tension: 0.2,
  //             },
  //           ],
  //         });
  //       });
  //   };
  //   // fetchStockPrice(ticker);

  //   const getStockDetails = () => {
  //     console.log(searchedstockData?.prices);
  //     // setlabels(searchedstockData?.prices.map((item) => item.date));
  //     // // const close_prices = searchedstockData?.prices.map(
  //     // //   (item) => item.close_price
  //     // // );
  //     // setclosePrices(searchedstockData?.prices.map(
  //     //   (item) => item.close_price
  //     // ))
  //     // console.log(labels);
  //     // console.log(close_prices);
  //     const todayClosePrice = searchedstockData?.prices.at(-1).close_price;
  //     const yesterdayClosePrice = searchedstockData?.prices.at(-2).close_price;
  //     setTodayClosePrice(searchedstockData?.prices.at(-1).close_price);
  //     setTodayHighPrice(searchedstockData?.prices.at(-1).high_price);
  //     setTodayLowPrice(searchedstockData?.prices.at(-1).low_price);
  //     setTodayVolume(searchedstockData?.prices.at(-1).volume);
  //     const diffPercentage = () => {
  //       // const todayClosePrice = searchedstockData?.prices.at(-1).close_price;
  //       // const yesterdayClosePrice = searchedstockData?.prices.at(-2).close_price;
  //       const priceDifference =
  //         ((todayClosePrice - yesterdayClosePrice) / yesterdayClosePrice) * 100;
  //       // console.log(secondLastElement);

  //       if (todayClosePrice > yesterdayClosePrice) {
  //         setGain(true);
  //       } else if (todayClosePrice == yesterdayClosePrice) {
  //         setEqual(true);
  //       } else {
  //         setGain(false);
  //       }

  //       setPriceDiff(priceDifference.toFixed(2));
  //       function truncateDecimals(num, digits) {
  //         const multiplier = Math.pow(10, digits);
  //         return ~~(num * multiplier) / multiplier;
  //       }
  //       return truncateDecimals(priceDifference, 2);
  //     };
  //     setPriceDiff(diffPercentage());
  //     const diffPoint = () => {
  //       // let secondLastElement = close_prices[lastIndex - 2];
  //       // console.log(secondLastElement);
  //       let pointDiff = todayClosePrice - yesterdayClosePrice;
  //       if (todayClosePrice > yesterdayClosePrice) {
  //         setGain(true);
  //       } else {
  //         setGain(false);
  //       }
  //       function truncateDecimals(num, digits) {
  //         const multiplier = Math.pow(10, digits);
  //         return ~~(num * multiplier) / multiplier;
  //       }
  //       return truncateDecimals(pointDiff, 2);
  //     };
  //     setPricePointDiff(diffPoint());
  //   };

  //   getStockDetails();
  //   // console.log(searchedstockData);

  //   const getStockTechnicalDetails = async (ticker) => {
  //     const response = await fetch(
  //       `http://127.0.0.1:8000/api/stock/${ticker}/`,
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: "Bearer " + authTokens?.access,
  //         },
  //       }
  //     );
  //     const data = await response.json();
  //     if (response.status === 200) {
  //       data?.map((item) => {
  //         setyearHighPrice(item.high_price_52_week);
  //         setyearLowPrice(item.low_price_52_week);
  //       });
  //     }
  //   };
  //   getStockTechnicalDetails(ticker);
  // }, [searchedstockData, ticker]);

  useEffect(() => {
    if (searchedstockData?.prices) {
      setLabels(searchedstockData.prices.map((item) => item.date));
      setClosePrices(searchedstockData.prices.map((item) => item.close_price));
      //set today ltp,high,low prices and volumes
      setTodayClosePrice(searchedstockData.prices.at(-1).close_price);
      setTodayHighPrice(searchedstockData.prices.at(-1).high_price);
      setTodayLowPrice(searchedstockData.prices.at(-1).low_price);
      setTodayVolume(searchedstockData.prices.at(-1).volume);

      let secondLastElement = searchedstockData.prices.at(-2).close_price;
      let lastElement = searchedstockData.prices.at(-1).close_price;
      const diffPercentage = () => {
        // console.log(secondLastElement);
        let percentageDiff =
          ((lastElement - secondLastElement) / secondLastElement) * 100;
        if (lastElement > secondLastElement) {
          setGain(true);
        } else {
          setGain(false);
        }
        if (lastElement > secondLastElement) {
          setGain(true);
        } else if (lastElement == secondLastElement) {
          setEqual(true);
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
        // let secondLastElement = close_prices[lastIndex - 2];
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
      // setTodayClosePrice(searchedstockData.prices.at(-1).close_price)
    }
  }, [searchedstockData]);

  // Set chartData once labels and closePrices are updated
  useEffect(() => {
    if (
      labels.length > 0 &&
      closePrices.length > 0 &&
      prediction?.predicted_price
    ) {
      const n = labels.length;
      // choose null or 0 based on your visual preference
      const predictedPrices = Array(n - 1)
        .fill(null)
        .concat(prediction?.predicted_price);
      setChartData({
        labels,
        datasets: [
          {
            label: "Close Price",
            data: closePrices,
            fill: true,
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
          {
            label: "Predicted Price",
            data: predictedPrices,
            backgroundColor: function (context) {
              const chart = context.chart;
              const { ctx, chartArea } = chart;
              return chartAreaGradient(ctx, chartArea, [
                {
                  stop: 0,
                  color: adjustColorOpacity(
                    getCssVariable("--color-green-500"),
                    0
                  ),
                },
                {
                  stop: 1,
                  color: adjustColorOpacity(
                    getCssVariable("--color-green-500"),
                    0.2
                  ),
                },
              ]);
            },
            borderColor: adjustColorOpacity(
              getCssVariable("--color-green-500"),
              1
            ),
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            pointBackgroundColor: adjustColorOpacity(
              getCssVariable("--color-green-500"),
              0.5
            ),
            pointHoverBackgroundColor: adjustColorOpacity(
              getCssVariable("--color-green-500"),
              1
            ),
            pointBorderWidth: 3,
            pointHoverBorderWidth: 0,
            clip: 20,
            tension: 0.2,
          },
        ],
      });
    }
  }, [labels, closePrices, prediction]);

  useEffect(() => {
    // searchedstockData?.map((searchedstockData) => (
    //   setStockSector(searchedstockData.stock.sector)
    // ))
    if (searchedstockData?.sector) {
      // setStockSector(searchedstockData?.sector);
      const stockCompetitors = async (sector) => {
        let response = await fetch(
          `http://127.0.0.1:8000/api/stocks/category/${sector}/`
        );
        let apiData = await response.json();
        setStockCompetitors(apiData);
        // console.log(apiData);
      };
      stockCompetitors(searchedstockData?.sector);
    }
  }, [searchedstockData]);
  useEffect(() => {
    if (!ticker) return;

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
        setsearchedstockData(apiData);

        return apiData;
      }
    };
    fetchStocks(ticker);
    const getStockTechnicalDetails = async (ticker) => {
      const response = await fetch(
        `http://127.0.0.1:8000/api/stock/${ticker}/`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + authTokens?.access,
          },
        }
      );
      const data = await response.json();
      // console.log(data)
      if (response.status === 200) {
        data?.map((item) => {
          setyearHighPrice(item.high_price_52_week);
          setyearLowPrice(item.low_price_52_week);
        });
      }
    };
    getStockTechnicalDetails(ticker);
  }, [ticker]);

  // new method
  const fetchPrediction = async (ticker) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/stock/${ticker}/prediction/`
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      // console.log(data);
      setPrediction(data);
      setError(null);
      setLoading(false);

      // If task is pending or in progress, keep polling every 5 seconds
      if (
        data.source === "celery" &&
        data.task_id &&
        (data.status === "Prediction queued" ||
          data.status === "Prediction in progress…")
      ) {
        pollInterval.current = setTimeout(() => fetchPrediction(ticker), 5000);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Start fetching on component mount or when ticker changes
  useEffect(() => {
    setLoading(true);
    setError(null);
    setPrediction(null);
    fetchPrediction(ticker);

    // Clean up polling on component unmount or ticker change
    return () => {
      if (pollInterval.current) {
        clearTimeout(pollInterval.current);
      }
    };
  }, [ticker]);

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
      "ones", // 1st digit from right
      "tens", // 2nd digit
      "hundreds", // 3rd digit
      "thousands", // 4th digit
      "ten thousands", // 5th digit
      "lakhs", // 6th digit
      "ten lakhs", // 7th digit
      "crores", // 8th digit
      "ten crores", // 9th digit
      "arab", // 9th digit
      "ten arab", // 9th digit
      "kharab", // 9th digit
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
    let market_cap = classifyMarketCap(
      Number.parseFloat(Number(marketCap).toFixed(4))
    );
    return (
      <span>
        A market capitalization of {ticker} is above{" "}
        {getIndianPlaceValue(Number.parseFloat(Number(marketCap).toFixed()))}{" "}
        places and falls on{" "}
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
          <div key={searchedstockData?.id}>
            {/* {setStockSector(searchedstockData.sector)} */}

            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              {/* Dashboard actions */}
              <div className="grid grid-cols-12 gap-6 m-2">
                <InfiniteScroll />
              </div>
              <div className="border-b border-gray-200 dark:border-gray-700/60 z-999"></div>
              <div className="sm:flex sm:justify-between sm:items-center mb-8">
                {/* Left: Title */}
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                    {searchedstockData?.name}
                  </h1>
                  <p className="text-xl md:text-xl text-gray-800 dark:text-gray-100 font-bold">
                    {searchedstockData?.ticker}
                  </p>
                </div>
                {/* <div className="mb-4 sm:mb-0">
                  <SearchBox placeholder="Search Symbols or Companies" />
                </div> */}

                {/* Right: Actions */}
              </div>

              {/* Latest Price Data and Chart */}
              <div className="mb-8 grow flex flex-col grid col-span-full sm:col-span-12 xl:col-span-12 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
                <div className="grid grid-cols-12 gap-2 ">
                  <div className="stock-price-chart col-span-9 flex flex-col">
                    <div className="daily-data flex flex-col pr-3 p-8 pb-0">
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
                          <div className="text-lg font-bold text-gray-700 mt-2 dark:text-gray-100 px-1.5">
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
                          <div className="text-lg font-bold text-gray-700 dark:text-gray-100 mt-2">
                            {todayVolume}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="text-sm font-normal text-gray-800 dark:text-gray-100 mr-2">
                            52 Weeks Range
                          </div>
                          <div className="text-lg font-bold text-gray-700 mt-2">
                            {yearLowPrice != null
                              ? Number.parseFloat(
                                  Number(yearLowPrice).toFixed(4)
                                )
                              : "-"}{" "}
                            -{" "}
                            {yearHighPrice != null
                              ? Number.parseFloat(
                                  Number(yearHighPrice).toFixed(4)
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
                          <div className="flex items-center justify-center ">
                            {/* <Spinner className="h-12 w-12" color="color-gray-500"/> */}
                            <Loader />
                          </div>
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
                        <span className="font-normal dark:text-gray-100 ">
                          {searchedstockData?.ticker} is trading{" "}
                          <StockPriceSignal
                            todayPrice={todayClosePrice}
                            low52Week={yearLowPrice}
                            high52Week={yearHighPrice}
                            thresholdPercent={2}
                          />{" "}
                          of its 52-week range .
                        </span>
                      </div>
                      <div className="price-change mb-3">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100 dark:font-bold">
                          Price Change
                        </h3>
                        <span className="font-normal">
                          The price of {searchedstockData?.ticker} shares has{" "}
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
                    About {searchedstockData?.ticker}
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
                          {searchedstockData?.sector}
                        </div>
                      </div>
                      <div className="flex mb-4 justify-between">
                        {/* Header */}
                        <div className="">Listed Share</div>
                        {/* Value */}
                        <div className="font-bold text-gray-600 dark:text-gray-300">
                          {searchedstockData?.listed_share}
                        </div>
                      </div>
                      <div className="flex mb-4 justify-between">
                        {/* Header */}
                        <div className="">Market Capitalization</div>
                        {/* Value */}
                        <div className="font-bold text-gray-600 dark:text-gray-300">
                          {searchedstockData?.market_cap != null
                            ? Number.parseFloat(
                                Number(searchedstockData?.market_cap).toFixed(4)
                              )
                            : "-"}
                        </div>
                      </div>
                      <div className="flex mb-4 justify-between">
                        {/* Header */}
                        <div className="">Earning Per Share</div>
                        {/* Value */}
                        <div className="font-bold text-gray-600 dark:text-gray-300">
                          {searchedstockData?.eps}
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
                          {searchedstockData?.pe_ratio}
                        </div>
                      </div>
                      <div className="flex mb-4 justify-between">
                        {/* Header */}
                        <div className="">Book Valve Per Share</div>
                        {/* Value */}
                        <div className="font-bold text-gray-600 dark:text-gray-300">
                          {searchedstockData?.bvps != null
                            ? Number.parseFloat(
                                Number(searchedstockData?.bvps).toFixed(4)
                              )
                            : "-"}
                        </div>
                      </div>
                      <div className="flex mb-4 justify-between">
                        {/* Header */}
                        <div className="">Paid Capital</div>
                        {/* Value */}
                        <div className="font-bold text-gray-600 dark:text-gray-300">
                          {searchedstockData?.paid_capital != null
                            ? Number.parseFloat(
                                Number(searchedstockData?.paid_capital).toFixed(
                                  4
                                )
                              )
                            : "-"}
                        </div>
                      </div>
                      <div className="flex mb-4 justify-between">
                        {/* Header */}
                        <div className="">Year Yield</div>
                        {/* Value */}
                        <div className="font-bold text-gray-600 dark:text-gray-300">
                          {searchedstockData?.year_yield} %
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
                      {formatIndianNumber(searchedstockData?.market_cap)}
                    </h3>
                    <div className="font-normal dark:text-gray-100">
                      {classifyMarketCapPlace(
                        searchedstockData?.market_cap,
                        searchedstockData?.ticker
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
                    {searchedstockData?.ticker} Competitors
                  </div>
                  {/* Table */}
                  {searchedstockData != null && stockCompetitors != null ? (
                    <StockCompetitorsTable
                      currentTicker={searchedstockData}
                      currentTickerPriceDiff={priceDiff}
                      currentTickerClosePrice={todayClosePrice}
                      currentTickerYearHighPrice={yearHighPrice}
                      currentTickerYearLowPrice={yearLowPrice}
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
                      {searchedstockData?.ticker}'s competitors are included in
                      the same sector ( {searchedstockData?.sector} ).
                    </span>
                  </div>
                  <div className="dark:text-gray-100">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                      Market cap: Rs.{" "}
                      {formatIndianNumber(searchedstockData?.market_cap)}
                    </h3>
                    <div className="dark:text-gray-300">
                      {classifyMarketCapPlace(
                        searchedstockData?.market_cap,
                        searchedstockData?.ticker
                      )}
                    </div>
                  </div>
                  <div>
                    <form action="" onSubmit={() => handlePredictionClick}>
                      <button type="submit">Predict</button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Test Stock Chart */}
              {/* <StockChartWithResolution rawData={searchedstockData?.prices}/> */}
            </div>
          </div>
        </main>

        {/* <Banner />s */}
      </div>
    </div>
  );
}
export default StockDetails;
