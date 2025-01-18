"use client"; // Marks the file to be rendered on the client side

// Import necessary modules from Chart.js
import { useEffect, useRef } from "react";
import {
  Chart,
  BarController,
  BarElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  ChartConfiguration,
} from "chart.js";

// Register the necessary Chart.js components
Chart.register(
  BarController, // Controller for bar charts
  BarElement,     // Element for rendering bar chart bars
  LinearScale,    // Scale for rendering numeric values on the axes
  CategoryScale,  // Scale for categories (x-axis)
  Title,          // Title plugin for rendering chart title
  Tooltip,        // Tooltip plugin for showing information on hover
  Legend          // Legend plugin for displaying chart legend
);

// Define types for the chart's props
interface IncomeExpenseChartProps {
  labels: string[]; // Categories or months (e.g., "January", "February")
  incomeData: number[]; // Income data for each label
  expenseData: number[]; // Expense data for each label
  timePeriod: string; // Label for the x-axis (e.g., "Month")
}

export default function IncomeExpenseChart({
  labels,
  incomeData,
  expenseData,
  timePeriod = "Time Period", // Default value for the time period label on x-axis
}: IncomeExpenseChartProps) {
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
      type: "bar", // Type of the chart (bar chart in this case)
      data: {
        labels, // x-axis labels (e.g., "January", "February")
        datasets: [
          {
            label: "Income", // Label for the income dataset
            data: incomeData, // Data for the income bars
            backgroundColor: "#4caf50", // Green color for income bars
          },
          {
            label: "Expense", // Label for the expense dataset
            data: expenseData, // Data for the expense bars
            backgroundColor: "#f44336", // Red color for expense bars
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
              color: "#fff", // White color for the legend labels
              font: {
                size: 14, // Font size for legend labels
              },
            },
          },
          tooltip: {
            enabled: true, // Enable tooltips on hover
            bodyFont: {
              size: 14, // Font size for the tooltip body text
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true, // Display title for the x-axis
              text: timePeriod, // Title text for the x-axis (e.g., "Month")
              color: "#fff", // White color for the title
              font: {
                size: 20, // Font size for the x-axis title
              },
            },
            ticks: {
              color: "#fff", // White color for x-axis ticks
              font: {
                size: 14, // Font size for x-axis tick labels
              },
            },
          },
          y: {
            title: {
              display: true, // Display title for the y-axis
              text: "Amount", // Title text for the y-axis (e.g., "Amount")
              color: "#fff", // White color for the title
              font: {
                size: 16, // Font size for the y-axis title
              },
            },
            ticks: {
              color: "#fff", // White color for y-axis ticks
              font: {
                size: 14, // Font size for y-axis tick labels
              },
            },
            beginAtZero: true, // Ensure the y-axis starts at 0
          },
        },
        animation: {
          duration: 1500, // Animation duration in milliseconds
          easing: "easeInOutQuad", // Easing function for the animation (smooth in/out)
        },
      },
    };

    // Initialize the chart with the defined configuration
    chartInstanceRef.current = new Chart(chartRef.current, config);
  }, [labels, incomeData, expenseData, timePeriod]); // Re-run the effect if any prop changes

  return (
    <div className="relative w-full h-80 md:h-96 lg:h-112">
      {/* Wrapper div to make the chart responsive */}
      <canvas ref={chartRef} className="w-full h-full" /> {/* The canvas where the chart is rendered */}
    </div>
  );
}
