import React, { useRef, useEffect, useState } from "react";
import { useThemeProvider } from "../utils/ThemeContext";
// import { adjustColorOpacity, getCssVariable } from "../../utils/Utils";
// import { chartColors, chartAreaGradient } from "../../charts/ChartjsConfig";
import { chartColors } from "./ChartjsConfig";
// import { Chart, registerables } from "chart.js";
import {
  Chart, LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip,
} from 'chart.js';
import "chartjs-adapter-moment";

// Import utilities
import { formatValue,formatThousands, formatDecimals } from "../utils/Utils";

// Chart.register(...registerables);
Chart.register(LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip);

function LineChart({ data, width, height }) {
  const [chart, setChart] = useState(null);
  const canvas = useRef(null);
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === "dark";
//   const { tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors;
  const { textColor, gridColor, tooltipTitleColor, tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors;

  useEffect(() => {
      const ctx = canvas.current;
      // eslint-disable-next-line no-unused-vars
      const newChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
          layout: {
            padding: 20,
          },
          scales: {
            y: {
              border: {
                display: true,
              },
              suggestedMin: 30,
              suggestedMax: 80,
              ticks: {
                maxTicksLimit: 5,
                callback: (value) => formatValue(value),
                color: darkMode ? textColor.dark : textColor.light,
              },
              grid: {
                color: darkMode ? gridColor.dark : gridColor.light,
              },
            },
            x: {
              type: 'time',
              time: {
                parser: 'hh:mm:ss',
                unit: 'second',
                tooltipFormat: 'MMM DD, H:mm:ss a',
                displayFormats: {
                  second: 'H:mm:ss',
                },
              },
              border: {
                display: false,
              },
              grid: {
                display: false,
              },
              ticks: {
                autoSkipPadding: 48,
                maxRotation: 0,
                color: darkMode ? textColor.dark : textColor.light,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              titleFont: {
                weight: 600,
              },
              callbacks: {
                label: (context) => formatValue(context.parsed.y),
              },
              titleColor: darkMode ? tooltipTitleColor.dark : tooltipTitleColor.light,
              bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
              backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
              borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
            },
          },
          interaction: {
            intersect: false,
            mode: 'nearest',
          },
          animation: false,
          maintainAspectRatio: false,
        },
      });
      setChart(newChart);
      return () => newChart.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  useEffect(() => {
      if (!chart) return
  
      if (darkMode) {
        chart.options.scales.x.ticks.color = textColor.dark;
        chart.options.scales.y.ticks.color = textColor.dark;
        chart.options.scales.y.grid.color = gridColor.dark;
        chart.options.plugins.tooltip.titleColor = tooltipTitleColor.dark;
        chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.dark;
        chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.dark;
        chart.options.plugins.tooltip.borderColor = tooltipBorderColor.dark;      
      } else {
        chart.options.scales.x.ticks.color = textColor.light;
        chart.options.scales.y.ticks.color = textColor.light;
        chart.options.scales.y.grid.color = gridColor.light;
        chart.options.plugins.tooltip.titleColor = tooltipTitleColor.light;
        chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
        chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.light;
        chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light; 
      }
      chart.update('none')
    }, [currentTheme])

  return <canvas ref={canvas} width={width} height={height}></canvas>;
}

export default LineChart;
