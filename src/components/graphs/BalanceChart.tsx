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

interface BalanceChartProps {
  labels: string[]; // Time periods (e.g., months, weeks)
  data: number[]; // Balance amounts for each label
  timePeriod: string;
}

export default function BalanceChart({
  labels,
  data,
  timePeriod = "Time Period",
}: BalanceChartProps) {
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
            tension: 0, // Curve smoothness
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Allow chart to resize based on container
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
              text: timePeriod,
              color: "#fff", // White color for X-axis title
              font: {
                size: 20, // Larger font size for X-axis title
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
        animation: {
          duration: 2000, // Animation duration in milliseconds
          easing: "easeInOutQuad", // Easing function for animation
        },
      },
    };

    // Initialize chart
    chartInstanceRef.current = new Chart(chartRef.current, config);
  }, [labels, data,timePeriod]);

  return (
    <div className="relative w-full h-80 md:h-96 lg:h-112">
      {/* The canvas is now wrapped in a responsive container */}
      <canvas ref={chartRef} className="w-full h-full" />
    </div>
  );
}
