"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StateRegistrationChartProps {
  registrations: any[];
}

export default function StateRegistrationChart({
  registrations,
}: StateRegistrationChartProps) {
  // Count registrations by state
  const stateCount = registrations.reduce((acc, registration) => {
    const state = registration.registrationType || "Unknown";
    acc[state] = (acc[state] || 0) + 1;
    return acc;
  }, {});

  // Sort states by registration count
  const sortedStates = Object.entries(stateCount)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 10); // Get top 10 states

  const data = {
    labels: sortedStates.map(([state]) => state),
    datasets: [
      {
        label: "Registrations",
        data: sortedStates.map(([, count]) => count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Registration Types",
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <Bar data={data} options={options} />
    </div>
  );
}
