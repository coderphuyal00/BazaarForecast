import React, { useRef, useEffect } from 'react';
import {
  Chart,
  LineController,
  LineElement,
  Filler,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
} from 'chart.js';
import 'chartjs-adapter-moment';
import { chartColors } from './ChartjsConfig';
import { formatValue } from '../utils/Utils';
import { useThemeProvider } from '../utils/ThemeContext';

Chart.register(LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip);

function LineChart01({ data }) {
  const canvas = useRef(null);
  const chartInstance = useRef(null);
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === 'dark';
  const { tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors;

  useEffect(() => {
    if (!canvas.current) return;

    chartInstance.current = new Chart(canvas.current, {
      type: 'line',
      data: data,
      options: {
        responsive: true,              // Enable responsiveness
        maintainAspectRatio: false,   // So canvas fills container size exactly
        layout: { padding: 10 },
        scales: {
          y: {
            display: true,
            beginAtZero: true,
            ticks: {
              callback: (value) => value.toLocaleString(),
              color: darkMode ? '#ccc' : '#666',
              font: { size: 12 },
            },
          },
          x: {
            type: 'time',
            time: {
              parser: 'MM-DD-YYYY',
              unit: 'month',
            },
            // min: data[0], // first label or date value
            // max: data[data.length - 1],
            display: true,
            ticks: {
              color: darkMode ? '#ccc' : '#666',
              font: { size: 12 },
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: { title: () => null, label: (ctx) => formatValue(ctx.parsed.y) },
            bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
            backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
            borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
          },
          legend: { display: false },
        },
        interaction: { intersect: false, mode: 'nearest' },
        resizeDelay: 200,
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [data, darkMode, tooltipBodyColor, tooltipBgColor, tooltipBorderColor]);

  // Update tooltip colors on theme change without recreating chart instance
  useEffect(() => {
    if (!chartInstance.current) return;
    const tooltip = chartInstance.current.options.plugins.tooltip;
    tooltip.bodyColor = darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light;
    tooltip.backgroundColor = darkMode ? tooltipBgColor.dark : tooltipBgColor.light;
    tooltip.borderColor = darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light;
    chartInstance.current.update('none');
  }, [darkMode, tooltipBodyColor, tooltipBgColor, tooltipBorderColor]);

  // Render with container div controlling size, no width/height on canvas props
  return (
    <div
      style={{
        position: 'relative',
        width: '600px',  // Set fixed width
        height: '300px', // Set fixed height
        margin: 'auto',
      }}
    >
      <canvas ref={canvas} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
}

export default LineChart01