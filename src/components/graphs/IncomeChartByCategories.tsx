"use client"; // Marks the file to be rendered on the client side

// Import necessary modules from Chart.js
import { useEffect, useRef } from "react";
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  ChartConfiguration,
} from "chart.js";

// Register required chart components
Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

// Define the types of the chart's props
interface SpendingChartProps {
  labels: string[]; // Categories or months (e.g., Food, Rent, etc.)
  data: number[];   // Spending amounts for each label
}

export default function SpendingChartByCategories({ labels, data }: SpendingChartProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null); // Ref to the canvas element for the chart
  const chartInstanceRef = useRef<Chart | null>(null); // Ref to store the chart instance

  useEffect(() => {
    if (!chartRef.current) return; // Ensure chartRef is not null before proceeding

    // Destroy the existing chart instance before creating a new one
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Define the chart's configuration
    const config: ChartConfiguration = {
      type: "doughnut", // Doughnut chart type
      data: {
        labels, // Labels for the slices (e.g., categories like Food, Rent)
        datasets: [
          {
            data, // Data for each slice (spending amounts for each category)
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
            ], // Background colors for each slice
            borderWidth: 2, // Border width for each slice
            hoverOffset: 15, // Highlight effect on hover (distance the slice moves out)
          },
        ],
      },
      options: {
        responsive: true, // Allow chart to resize based on container size
        maintainAspectRatio: false, // Allow chart aspect ratio to change
        plugins: {
          legend: {
            display: true, // Display the legend
            position: "top", // Position the legend at the top
            labels: {
              color: "#fff", // White text for legend labels
              font: {
                size: 14, // Font size for legend labels
              },
            },
          },
          tooltip: {
            enabled: true, // Enable tooltips on hover
            callbacks: {
              // Custom tooltip format: show percentage along with value
              label: (tooltipItem) => {
                const dataset = tooltipItem.dataset;
                const value = dataset.data[tooltipItem.dataIndex] as number;
                const total = (dataset.data as number[]).reduce((acc, val) => acc + val, 0);
                const percentage = ((value / total) * 100).toFixed(2);
                return `${tooltipItem.label}: ${value} (${percentage}%)`; // Display label, value, and percentage
              },
            },
          },
        },
        animation: {
          duration: 700, // Animation duration in milliseconds
          easing: "easeInOutQuad", // Easing function for smooth animation
        },
        onHover: (event, elements) => {
          // Change cursor style when hovering over chart slices
          if (elements.length) {
            (event.native?.target as HTMLElement)?.style?.setProperty("cursor", "pointer");
          } else {
            (event.native?.target as HTMLElement)?.style?.setProperty("cursor", "default");
          }
        },
      },
    };

    // Initialize chart with the provided configuration
    chartInstanceRef.current = new Chart(chartRef.current, config);
  }, [labels, data]); // Re-run the effect if labels or data props change

  return (
    <div className="relative w-full h-80 md:h-96 lg:h-112">
      {/* The canvas element is now wrapped in a responsive container */}
      <canvas ref={chartRef} className="w-full h-full" />
    </div>
  );
}
