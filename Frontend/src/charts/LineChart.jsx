import React, { useRef, useEffect, useState } from "react";
import { useThemeProvider } from "../utils/ThemeContext";
// import { adjustColorOpacity, getCssVariable } from "../../utils/Utils";
// import { chartColors, chartAreaGradient } from "../../charts/ChartjsConfig";
import { chartColors } from "./ChartjsConfig";
import { Chart, registerables } from "chart.js";
import "chartjs-adapter-moment";

// Import utilities
import { formatThousands, formatDecimals } from "../utils/Utils";

Chart.register(...registerables);

function LineChart({ data, width, height }) {
  const [chart, setChart] = useState(null);
  const canvas = useRef(null);
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === "dark";
  const { tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors;

  useEffect(() => {
    const ctx = canvas.current;
    // eslint-disable-next-line no-unused-vars
    const newChart = new Chart(ctx, {
      type: "line",
      data: data,
      options: {
        layout: {
          padding: 20,
        },
        scales: {
          y: {
            display: false,
            beginAtZero: true,
          },
          x: {
            type: "time",
            min: data[0], // first label or date value
            max: data[data.length - 1],
            display: false,
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: (tooltipItems) => {
                // tooltipItems is an array, usually has one item for line charts
                const dateStr =
                  tooltipItems[0].label || tooltipItems[0].parsed.x;
                const date = new Date(dateStr);

                // Example: Format date as "MMMM dd, yyyy" using Intl.DateTimeFormat
                return new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }).format(date);
              },

              // Show price as label, preserve decimals as needed
              label: (tooltipItem) => {
                // const price = tooltipItem.parsed.y;
                // // Format price as string without abbreviation, showing full decimals
                // return `${price.toString()}`;
                const datasetLabel = tooltipItem.dataset.label || "";
                const value =
                  tooltipItem.parsed.y !== undefined
                    ? tooltipItem.parsed.y
                    : tooltipItem.parsed;

                if (datasetLabel === "Predicted Price") {
                  return `Predicted Price for Tomorrow: Rs.${value.toFixed(2)}`;
                }

                return `${datasetLabel}: Rs.${value.toFixed(2)}`;
              },
            },
            titleColor: darkMode
              ? tooltipBodyColor.light
              : tooltipBodyColor.dark,
            bodyColor: darkMode
              ? tooltipBodyColor.dark
              : tooltipBodyColor.light,
            backgroundColor: darkMode
              ? tooltipBgColor.dark
              : tooltipBgColor.light,
            borderColor: darkMode
              ? tooltipBorderColor.dark
              : tooltipBorderColor.light,
          },
          legend: {
            display: true,
          },
        },
        interaction: {
          intersect: false,
          mode: "nearest",
        },
        maintainAspectRatio: false,
        resizeDelay: 200,
      },
    });
    setChart(newChart);
    return () => newChart.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!chart) return;

    if (darkMode) {
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.dark;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.dark;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.dark;
    } else {
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.light;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light;
    }
    chart.update("none");
  }, [currentTheme]);

  return <canvas ref={canvas} width={width} height={height}></canvas>;
}

export default LineChart;
