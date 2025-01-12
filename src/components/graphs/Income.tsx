"use client";

import { useEffect, useRef } from "react";
import {
  Chart,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
  ChartConfiguration,
} from "chart.js";

Chart.register(PieController, ArcElement, Tooltip, Legend);

interface IncomeDistributionChartProps {
  labels: string[]; // Income sources
  data: number[]; // Income amounts for each source
}

export default function IncomeDistributionChart({
  labels,
  data,
}: IncomeDistributionChartProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const config: ChartConfiguration = {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: [
              "#4caf50", // Green
              "#2196f3", // Blue
              "#ff9800", // Orange
              "#f44336", // Red
              "#9c27b0", // Purple
            ],
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
      },
    };

    chartInstanceRef.current = new Chart(chartRef.current, config);
  }, [labels, data]);

  return (
    <div className="relative w-full h-80 md:h-96 lg:h-112">
      <canvas ref={chartRef} className="w-full h-full" />
    </div>
  );
}
