"use client";

import { useEffect, useRef } from "react";
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  ChartConfiguration,
} from "chart.js";

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

interface SpendingChartProps {
  labels: string[]; // Categories or months
  data: number[];   // Spending amounts for each label
}

export default function SpendingChartByCategories({ labels, data }: SpendingChartProps) {
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
              "#00bcd4", // Cyan
              "#ffeb3b", // Yellow
              "#e91e63", // Pink
              "#8bc34a", // Light Green
              "#3f51b5", // Indigo
              "#795548", // Brown
              "#607d8b", // Blue Grey
            ],
            borderWidth: 2,
            hoverOffset: 15, // Highlight effect on hover
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              color: "#fff", // White text for legend
              font: {
                size: 14,
              },
            },
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: (tooltipItem) => {
                const dataset = tooltipItem.dataset;
                const value = dataset.data[tooltipItem.dataIndex] as number;
                const total = (dataset.data as number[]).reduce((acc, val) => acc + val, 0);
                const percentage = ((value / total) * 100).toFixed(2);
                return `${tooltipItem.label}: ${value} (${percentage}%)`;
              },
            },
          },
        },
        animation: {
          duration: 700,      // Duration in milliseconds
          easing: "easeInOutQuad",
        },
        onHover: (event, elements) => {
          if (elements.length) {
            (event.native?.target as HTMLElement)?.style?.setProperty("cursor", "pointer");
          } else {
            (event.native?.target as HTMLElement)?.style?.setProperty("cursor", "default");
          }
        },
      },
    };

    // Initialize chart
    chartInstanceRef.current = new Chart(chartRef.current, config);
  }, [labels, data]);

  return (
    <div className="relative w-full h-80 md:h-96 lg:h-112">
      <canvas ref={chartRef} className="w-full h-full" />
    </div>
  );
}
