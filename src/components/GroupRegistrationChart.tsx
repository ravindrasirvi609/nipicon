"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface GroupData {
  _id: string;
  count: number;
  totalAmount: number;
  completedPayments: number;
}

interface GroupRegistrationChartProps {
  groupData: GroupData[];
}

export default function GroupRegistrationChart({
  groupData,
}: GroupRegistrationChartProps) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Group-wise Registration Distribution",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const data = {
    labels: groupData.map((group) => group._id || "No Group"),
    datasets: [
      {
        label: "Total Registrations",
        data: groupData.map((group) => group.count),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        borderColor: "rgba(53, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Completed Payments",
        data: groupData.map((group) => group.completedPayments),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white/30 backdrop-blur-lg rounded-xl p-6 shadow-lg">
      <Bar options={options} data={data} />
    </div>
  );
}
