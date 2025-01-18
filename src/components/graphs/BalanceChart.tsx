"use client"; // Marks the file to be rendered on the client side

// Import necessary modules from Chart.js
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

// Register all the required chart components
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

// Define the types of the chart's props
interface BalanceChartProps {
  labels: string[]; // Time periods (e.g., months, weeks)
  data: number[]; // Balance amounts for each label
  timePeriod: string; // Customizable label for the X-axis (time period)
}

export default function BalanceChart({
  labels,
  data,
  timePeriod = "Time Period",
}: BalanceChartProps) {
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
      type: "line", // Line chart type
      data: {
        labels, // X-axis labels (e.g., months, weeks)
        datasets: [
          {
            label: "Balance Over Time", // Dataset label
            data, // Y-axis data (balance amounts)
            backgroundColor: "rgba(33, 150, 243, 0.2)", // Light blue background for the area under the line
            borderColor: "#2196f3", // Blue color for the line
            borderWidth: 2, // Line width
            pointBackgroundColor: "#2196f3", // Color of the points on the line
            pointBorderColor: "#fff", // Color of the points' border
            fill: true, // Fill the area under the line
            tension: 0, // Set to 0 for no curve (linear line)
          },
        ],
      },
      options: {
        responsive: true, // Allow chart to resize based on container
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
            enabled: true, // Enable tooltips
            titleFont: {
              size: 14, // Font size for tooltip title
            },
            bodyFont: {
              size: 12, // Font size for tooltip body
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true, // Display title for the X-axis
              text: timePeriod, // Use the provided timePeriod prop as the title
              color: "#fff", // White color for X-axis title
              font: {
                size: 20, // Font size for X-axis title
              },
            },
            ticks: {
              color: "#fff", // White color for X-axis ticks
              font: {
                size: 14, // Font size for X-axis ticks
              },
            },
          },
          y: {
            title: {
              display: true, // Display title for the Y-axis
              text: "Balance Amount", // Title for the Y-axis
              color: "#fff", // White color for Y-axis title
              font: {
                size: 16, // Font size for Y-axis title
              },
            },
            ticks: {
              color: "#fff", // White color for Y-axis ticks
              font: {
                size: 14, // Font size for Y-axis ticks
              },
            },
            beginAtZero: true, // Ensure the Y-axis starts from zero
          },
        },
        animation: {
          duration: 2000, // Animation duration (2 seconds)
          easing: "easeInOutQuad", // Easing function for smooth animation
        },
      },
    };

    // Create a new chart instance with the provided configuration
    chartInstanceRef.current = new Chart(chartRef.current, config);
  }, [labels, data, timePeriod]); // Re-run the effect if the labels, data, or timePeriod props change

  return (
    <div className="relative w-full h-80 md:h-96 lg:h-112">
      {/* The canvas element wrapped in a responsive container */}
      <canvas ref={chartRef} className="w-full h-full" />
    </div>
  );
}
