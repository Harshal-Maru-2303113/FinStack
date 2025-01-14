"use client";

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

Chart.register(
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

interface IncomeExpenseChartProps {
  labels: string[]; // Categories or months
  incomeData: number[]; // Income data
  expenseData: number[]; // Expense data
  timePeriod: string;
}

export default function IncomeExpenseChart({
  labels,
  incomeData,
  expenseData,
  timePeriod = "Time Period",
}: IncomeExpenseChartProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const config: ChartConfiguration = {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Income",
            data: incomeData,
            backgroundColor: "#4caf50", // Green for income
          },
          {
            label: "Expense",
            data: expenseData,
            backgroundColor: "#f44336", // Red for expense
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
              color: "#fff",
              font: {
                size: 14,
              },
            },
          },
          tooltip: {
            enabled: true,
            bodyFont: {
              size: 14,
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: timePeriod,
              color: "#fff",
              font: {
                size: 20,
              },
            },
            ticks: {
              color: "#fff",
              font: {
                size: 14,
              },
            },
          },
          y: {
            title: {
              display: true,
              text: "Amount",
              color: "#fff",
              font: {
                size: 16,
              },
            },
            ticks: {
              color: "#fff",
              font: {
                size: 14,
              },
            },
            beginAtZero: true,
          },
        },
        animation: {
          duration: 1500, // Animation duration in milliseconds
          easing: "easeInOutQuad", // Easing function for the animation
        },
      },
    };

    chartInstanceRef.current = new Chart(chartRef.current, config);
  }, [labels, incomeData, expenseData,timePeriod]);

  return (
    <div className="relative w-full h-80 md:h-96 lg:h-112">
      <canvas ref={chartRef} className="w-full h-full" />
    </div>
  );
}
