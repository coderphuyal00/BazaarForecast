import React, { useEffect, useState } from "react";
import LineChart from "../../charts/LineChart";
import { chartAreaGradient } from "../../charts/ChartjsConfig";

// Import utilities
import { adjustColorOpacity, getCssVariable } from "../../utils/Utils";

const fetchDataOncePerDay = async () => {
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
  const response = await fetch("http://127.0.0.1:8000/api/index-price/nepse/");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const apiData = await response.json();

  // Save to localStorage with current timestamp
  localStorage.setItem(cacheKey, JSON.stringify(apiData));
  localStorage.setItem(cacheTimestampKey, now.toISOString());

  return apiData;
};
function DashboardCard01() {
  const [chartData, setChartData] = useState(null);
  const [todayPrice, setTodayPrice] = useState();
  const [priceDiff, setPriceDiff] = useState();
  const [isGain, setGain] = useState();
  const [latestDate, setLatestDate] = useState();
  useEffect(() => {
    fetchDataOncePerDay()
      .then((data) => {
        // Format data to chart.js structure: labels and data points
        // Assuming the API returns an array with date and price fields, e.g.:
        // [{ date: "2025-07-20", price: 1400 }, { date: "2025-07-21", price: 1420 }, ...]
        const labels = data.map((item) => item.date);
        const prices = data.map((item) => item.close_price);
        // const latestPrice=prices.pop()
        let lastIndex = prices.length;
        let lastElement = prices[lastIndex - 1];
        let lastDate = labels[lastIndex - 1];
        const date = new Date(lastDate)
        setLatestDate(
          date.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: undefined,
            })
            .replace(/\//g, ",")
        )
        setTodayPrice(lastElement);
        const diffPercentage = () => {
          let secondLastElement = prices[lastIndex - 2];
          console.log(secondLastElement);
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
        // console.log(diffPercentage());
        setChartData({
          labels,
          datasets: [
            {
              label: "NEPSE Index Price",
              data: prices,
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
              pointBorderWidth: 0,
              pointHoverBorderWidth: 0,
              clip: 20,
              tension: 0.2,
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error fetching NEPSE data:", error);
      });
  }, []);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Nepse Index
          </h2>
        </header>
        <div className="text-m font-semibold text-gray-400 dark:text-gray-500 uppercase mb-4">
          {latestDate} | 3:00 PM
        </div>
        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">
            {todayPrice}
          </div>
          {isGain ? (
            <div className="text-sm font-medium text-green-700 mt-2 px-1.5 bg-green-500/20 rounded-full">
              +{priceDiff}
            </div>
          ) : (
            <div className="text-sm font-medium text-red-700 mt-2 px-1.5 bg-red-500/20 rounded-full">
              {priceDiff}
            </div>
          )}
          {/* <div className="text-sm font-medium text-green-700 mt-2 px-1.5 bg-green-500/20 rounded-full">
            +49%
          </div> */}
        </div>
      </div>
      {/* Chart built with Chart.js 3 */}
      <div className="grow max-sm:max-h-[128px] xl:max-h-[128px] pb-0 mb-0">
        {/* Change the height attribute to adjust the chart height */}
        {chartData ? (
          <LineChart data={chartData} width={389} height={128} />
        ) : (
          <p>Loading chart...</p>
        )}
      </div>
    </div>
  );
}

export default DashboardCard01;
