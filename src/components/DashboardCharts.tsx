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
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const ChartCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="px-4 py-5 sm:p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  </div>
);
interface DashboardChartsProps {
  data: {
    paymentStatus: { completed: number; pending: number; failed: number };
    abstractStatus: { [key: string]: number };
    registrationTypes: { [key: string]: number };
    monthlyRegistrations: { [key: string]: number };
  };
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ data }) => {
  const paymentStatusChartData = {
    labels: ["Completed", "Pending", "Failed"],
    datasets: [
      {
        data: [
          data.paymentStatus.completed,
          data.paymentStatus.pending,
          data.paymentStatus.failed,
        ],
        backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
      },
    ],
  };

  const abstractStatusChartData = {
    labels: Object.keys(data.abstractStatus),
    datasets: [
      {
        data: Object.values(data.abstractStatus),
        backgroundColor: ["#2196F3", "#FF9800", "#F44336", "#4CAF50"],
      },
    ],
  };

  const registrationTypeChartData = {
    labels: Object.keys(data.registrationTypes),
    datasets: [
      {
        label: "Registration Types",
        data: Object.values(data.registrationTypes),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const registrationTrendChartData = {
    labels: Object.keys(data.monthlyRegistrations),
    datasets: [
      {
        label: "Monthly Registrations",
        data: Object.values(data.monthlyRegistrations),
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
      <ChartCard title="Payment Status">
        <Pie data={paymentStatusChartData} />
      </ChartCard>
      <ChartCard title="Abstract Status">
        <Pie data={abstractStatusChartData} />
      </ChartCard>
      <ChartCard title="Registration Types">
        <Bar
          data={registrationTypeChartData}
          options={{
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Number of Registrations",
                },
              },
            },
          }}
        />
      </ChartCard>
      <ChartCard title="Registration Trend">
        <Line
          data={registrationTrendChartData}
          options={{
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Number of Registrations",
                },
              },
            },
          }}
        />
      </ChartCard>
    </div>
  );
};

export default DashboardCharts;
