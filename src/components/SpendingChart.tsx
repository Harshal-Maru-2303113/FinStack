"use client";

import { useEffect, useRef } from "react";
import { Chart, ChartConfiguration } from "chart.js";

interface SpendingChartProps {
  labels: string[]; // Categories or months
  data: number[];   // Spending amounts for each label
}

export default function SpendingChart({ labels, data }: SpendingChartProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart instance before re-creating
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Chart configuration
    const config: ChartConfiguration = {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: [
              "#4caf50", // Green
              "#f44336", // Red
              "#ff9800", // Orange
              "#2196f3", // Blue
              "#9c27b0", // Purple
            ],
            borderWidth: 1,
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
                size: 16, // Larger font size for legend
              },
            },
          },
          tooltip: {
            enabled: true,
            bodyFont: {
              size: 14, // Larger font size for tooltips
            },
          },
        },
      },
    };

    // Initialize chart
    chartInstanceRef.current = new Chart(chartRef.current, config);
  }, [labels, data]);

  return <canvas ref={chartRef} />;
}
