import React, { useEffect, useState, useContext } from "react";
import { chartAreaGradient } from "../charts/ChartjsConfig";
import LineChart from "../charts/LineChart01";
import AuthContext from "../components/context/AuthContext";
// Import utilities
import { getCssVariable, adjustColorOpacity } from "../utils/Utils";

function PorfolioChart() {
  const { authTokens } = useContext(AuthContext);
  const [portfolioValue, setPortfolioValue] = useState(null);
  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function FetchPortfolioValue() {
      try {
        const checkResponse = await fetch(
          "http://127.0.0.1:8000/api/user/portfolio/",
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + authTokens?.access,
              "Content-Type": "application/json",
            },
          }
        );

        if (!checkResponse.ok) {
          console.error("Failed to fetch today's portfolio data");
          return;
        }

        const todayData = await checkResponse.json();
        console.log(todayData);
        setPortfolioValue(todayData);

        if (todayData) {
          // Assuming todayData.portfolio_value_date and portfolio_value are arrays or strings for chart
          setLabels(Array.isArray(todayData.map((item)=>item.portfolio_value_date)) ? todayData.map((item)=>item.portfolio_value_date) : [todayData.map((item)=>item.portfolio_value_date)]);
          setValues(Array.isArray(todayData.map((item)=>item.portfolio_value)) ? todayData.map((item)=>item.portfolio_value) : [todayData.map((item)=>item.portfolio_value)]);
        //   setLabels(todayData.map((item)=>item.portfolio_value_date))
        //   setValues(todayData.map((item)=>item.portfolio_value))
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
    FetchPortfolioValue();
  }, []);
useEffect(()=>{
console.log("labels:"+labels)
console.log("values:"+values)
},[labels,values])
  useEffect(() => {
    if (labels === 0 || values === 0) {
      return;
    }
    setChartData({
      labels,
      datasets: [
        {
          label: "NEPSE Index Price",
          data: values,
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
  }, [values,labels,portfolioValue]);
  const options = {
  maintainAspectRatio: false, // Important to allow custom sizing
  responsive: true,
  scales: {
    y: {
      beginAtZero: false,
      ticks: {
        // Format ticks nicely for large numbers
        callback: function(value) {
          return value.toLocaleString(); // e.g., 276,521.5 formatted with commas
        }
      }
    }
  }
};


  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Portfolio
        </h2>
      </header>
      {chartData ? (
        <LineChart data={chartData} width={389} height={128} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
}

export default PorfolioChart;
