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

// Register the necessary Chart.js components
Chart.register(
  DoughnutController, // Controller for doughnut charts
  ArcElement,         // Element for rendering doughnut chart slices
  Tooltip,            // Tooltip plugin for showing information on hover
  Legend              // Legend plugin for displaying chart legend
);

// Define types for the chart's props
interface SpendingChartProps {
  labels: string[]; // Categories or months (e.g., "Groceries", "Entertainment")
  data: number[];   // Spending amounts for each category
}

export default function SpendingChartByCategories({ labels, data }: SpendingChartProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null); // Ref for the canvas element (used by Chart.js)
  const chartInstanceRef = useRef<Chart | null>(null); // Ref for storing the chart instance

  useEffect(() => {
    if (!chartRef.current) return; // Ensure the canvas is present before creating the chart

    // Destroy the previous chart instance (if any) to prevent memory leaks
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Define the chart's configuration
    const config: ChartConfiguration = {
      type: "doughnut", // Type of the chart (doughnut chart in this case)
      data: {
        labels, // x-axis labels (e.g., "Groceries", "Entertainment")
        datasets: [
          {
            data, // Data for the doughnut slices
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
            hoverOffset: 15, // Highlight effect on hover (distance the slice moves)
          },
        ],
      },
      options: {
        responsive: true, // Ensure the chart is responsive and adjusts to screen size
        maintainAspectRatio: false, // Allow the aspect ratio to change with resizing
        plugins: {
          legend: {
            display: true, // Display the legend on the chart
            position: "top", // Position the legend at the top
            labels: {
              color: "#fff", // White color for the legend text
              font: {
                size: 14, // Font size for the legend labels
              },
            },
          },
          tooltip: {
            enabled: true, // Enable tooltips on hover
            callbacks: {
              // Customize the tooltip content
              label: (tooltipItem) => {
                const dataset = tooltipItem.dataset;
                const value = dataset.data[tooltipItem.dataIndex] as number;
                const total = (dataset.data as number[]).reduce((acc, val) => acc + val, 0); // Calculate total spending
                const percentage = ((value / total) * 100).toFixed(2); // Calculate percentage of total spending
                return `${tooltipItem.label}: ${value} (${percentage}%)`; // Return label and percentage in tooltip
              },
            },
          },
        },
        animation: {
          duration: 1500, // Animation duration in milliseconds
          easing: "easeInOutQuad", // Easing function for the animation (smooth in/out)
        },
        onHover: (event, elements) => {
          // Change cursor style on hover to indicate interaction
          if (elements.length) {
            (event.native?.target as HTMLElement)?.style?.setProperty("cursor", "pointer");
          } else {
            (event.native?.target as HTMLElement)?.style?.setProperty("cursor", "default");
          }
        },
      },
    };

    // Initialize the chart with the defined configuration
    chartInstanceRef.current = new Chart(chartRef.current, config);
  }, [labels, data]); // Re-run the effect if any prop changes (labels or data)

  return (
    <div className="relative w-full h-80 md:h-96 lg:h-112">
      {/* Wrapper div to make the chart responsive */}
      <canvas ref={chartRef} className="w-full h-full" /> {/* The canvas where the chart is rendered */}
    </div>
  );
}
