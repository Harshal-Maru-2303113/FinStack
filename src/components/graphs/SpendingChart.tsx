"use client";

import { useEffect, useRef } from "react";
import {
  Chart,
  DoughnutController,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  ChartConfiguration,
} from "chart.js";

Chart.register(
  DoughnutController,
  ArcElement,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

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
              "#00bcd4", // Cyan
              "#ffeb3b", // Yellow
              "#e91e63", // Pink
              "#8bc34a", // Light Green
              "#3f51b5", // Indigo
              "#795548", // Brown
              "#607d8b", // Blue Grey
            ],
            
            borderWidth: 1,
            hoverOffset: 10, // Highlight effect on hover
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Makes the chart responsive to container size
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
            callbacks: {
              label: (tooltipItem) => {
                // Format the tooltip label with percentage
                const dataset = tooltipItem.dataset;
                const currentValue = dataset.data[tooltipItem.dataIndex] as number;
                const total = (dataset.data as number[]).reduce((acc, val) => acc + val, 0);
                const percentage = ((currentValue / total) * 100).toFixed(2);
                return `${tooltipItem.label}: ${currentValue} (${percentage}%)`;
              },
            },
          },
        },
        animation: {
          duration: 1000, // Animation duration in milliseconds
          easing: "easeInOutQuad", // Smooth easing for animations
          onProgress: undefined, // Optional: Event handler during animation
          onComplete: undefined, // Optional: Event handler after animation completes
        },
        

      },
    };

    // Initialize chart
    chartInstanceRef.current = new Chart(chartRef.current, config);
  }, [labels, data]);

  return (
    <div
    className="relative w-full max-w-700px h-auto"
    >
      <canvas ref={chartRef} />
    </div>
  );
}
