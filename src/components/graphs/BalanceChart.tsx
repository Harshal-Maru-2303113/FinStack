"use client";

import { useEffect, useRef } from "react";
import { Chart, ChartConfiguration, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from "chart.js";

interface BalanceChartProps {
  labels: string[]; // Time periods (e.g., months, weeks)
  data: number[];   // Balance amounts for each label
}

export default function BalanceChart({ labels, data }: BalanceChartProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart instance before re-creating
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Register Chart.js components
    Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

    // Chart configuration
    const config: ChartConfiguration = {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Balance Over Time",
            data,
            backgroundColor: "rgba(33, 150, 243, 0.2)", // Light Blue
            borderColor: "#2196f3", // Blue
            borderWidth: 2,
            pointBackgroundColor: "#2196f3",
            pointBorderColor: "#fff",
            fill: true, // Fill area under the line
            tension: 0.4, // Curve smoothness
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              color: "#fff", // White text for legend
              font: {
                size: 14, // Larger font size for legend
              },
            },
          },
          tooltip: {
            enabled: true,
            titleFont: {
              size: 14,
            },
            bodyFont: {
              size: 12,
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Time Period",
              color: "#fff", // White color for X-axis title
              font: {
                size: 16, // Larger font size for X-axis title
              },
            },
            ticks: {
              color: "#fff", // White color for X-axis ticks
              font: {
                size: 14, // Larger font size for X-axis ticks
              },
            },
          },
          y: {
            title: {
              display: true,
              text: "Balance Amount",
              color: "#fff", // White color for Y-axis title
              font: {
                size: 16, // Larger font size for Y-axis title
              },
            },
            ticks: {
              color: "#fff", // White color for Y-axis ticks
              font: {
                size: 14, // Larger font size for Y-axis ticks
              },
            },
            beginAtZero: true,
          },
        },
      },
    };

    // Initialize chart
    chartInstanceRef.current = new Chart(chartRef.current, config);
  }, [labels, data]);

  return <canvas ref={chartRef} />;
}
