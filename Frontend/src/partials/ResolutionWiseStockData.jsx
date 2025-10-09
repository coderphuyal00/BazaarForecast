import React, { useState, useEffect, useMemo } from "react";
import { Line } from "react-chartjs-2";
import LineChart1 from "../charts/LineChart";
import { chartAreaGradient } from "../charts/ChartjsConfig";
import { getCssVariable, adjustColorOpacity } from "../utils/Utils";

// Helper to aggregate daily data to weekly
function aggregateWeekly(data) {
  let weeks = [];
  let tempWeek = [];
  let currentWeek = null;
  
  data.forEach(item => {
    const date = new Date(item.date);
    const weekNumber = `${date.getFullYear()}-${Math.ceil((date.getDate() + 6 - date.getDay()) / 7)}`;
    if (weekNumber !== currentWeek) {
      if (tempWeek.length) {
        // Push last week's aggregated data (use last close price)
        weeks.push({
          date: tempWeek[tempWeek.length - 1].date,
          close_price: tempWeek[tempWeek.length - 1].close_price,
        });
        tempWeek = [];
      }
      currentWeek = weekNumber;
    }
    tempWeek.push(item);
  });
  // Push last week
  if (tempWeek.length) {
    weeks.push({
      date: tempWeek[tempWeek.length - 1].date,
      close_price: tempWeek[tempWeek.length - 1].close_price,
    });
  }
  return weeks;
}

// Helper to aggregate daily data to monthly
function aggregateMonthly(data) {
  let months = [];
  let tempMonth = [];
  let currentMonth = null;

  data.forEach(item => {
    const date = new Date(item.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    if (monthKey !== currentMonth) {
      if (tempMonth.length) {
        // Use last close for the month
        months.push({
          date: tempMonth[tempMonth.length - 1].date,
          close_price: tempMonth[tempMonth.length - 1].close_price,
        });
        tempMonth = [];
      }
      currentMonth = monthKey;
    }
    tempMonth.push(item);
  });
  if (tempMonth.length) {
    months.push({
      date: tempMonth[tempMonth.length - 1].date,
      close_price: tempMonth[tempMonth.length - 1].close_price,
    });
  }
  return months;
}


const StockChartWithResolution = ({ rawData }) => {
  const [resolution, setResolution] = useState("daily"); // daily, weekly, or monthly

  // Compute resolved data based on resolution choice
  const resolvedData = useMemo(() => {
    if (!rawData) return [];

    switch (resolution) {
      case "weekly":
        return aggregateWeekly(rawData);
      case "monthly":
        return aggregateMonthly(rawData);
      case "daily":
      default:
        return rawData;
    }
  }, [rawData, resolution]);

  const chartData = useMemo(() => {
    return {
      labels: resolvedData.map((item) => item.date),
      datasets: [
                {
                  label: "NEPSE Index Price",
                  data: resolvedData.map((item) => item.close_price),
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
    };
  }, [resolvedData]);

  return (
    <div>
      <div>
        <label>Resolution: </label>
        <select value={resolution} onChange={(e) => setResolution(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <Line data={chartData} />
      {/* <LineChart1 data={chartData} /> */}
    </div>
  );
};

export default StockChartWithResolution;
