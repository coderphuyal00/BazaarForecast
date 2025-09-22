import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useThemeProvider } from "../../utils/ThemeContext";
import { adjustColorOpacity, getCssVariable } from "../../utils/Utils";
import { chartColors, chartAreaGradient } from "../../charts/ChartjsConfig";
import LineChart01 from "../../charts/LineChart01";
import { formatValue,formatThousands } from "../../utils/Utils";
Chart.register(...registerables);

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
      // Use cached data if less than 1 day old
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

const NepseLineChart = () => {
  const [chartData, setChartData] = useState(null);
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === "dark";
  const { tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors;
  useEffect(() => {
    fetchDataOncePerDay()
      .then((data) => {
        // Format data to chart.js structure: labels and data points
        // Assuming the API returns an array with date and price fields, e.g.:
        // [{ date: "2025-07-20", price: 1400 }, { date: "2025-07-21", price: 1420 }, ...]
        const labels = data.map((item) => item.date);
        const prices = data.map((item) => item.close_price);

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
  const options = {
    layout: {
      padding: 20,
    },
    scales: {
      y: {
        display: false,
        beginAtZero: true,
      },
      x: {
        type: 'time',
         time: {
          unit: "day",
        },        
        display: false,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: () => false, // Disable tooltip title
          label: (context) => formatThousands(context.parsed.y),
        },
        bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
        backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
        borderColor: darkMode
          ? tooltipBorderColor.dark
          : tooltipBorderColor.light,
      },
      legend: {
        display: false,
      },
      
    },
    interaction: {
      intersect: false,
      mode: "nearest",
    },
    maintainAspectRatio: false,
    resizeDelay: 200,
  };
  

  return (
    <div>{chartData ? <Line data={chartData} options={options}/> : <p>Loading chart...</p>}</div>
  );
};

export default NepseLineChart;
