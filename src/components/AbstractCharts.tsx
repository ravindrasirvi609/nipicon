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

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Data {
  completedRegistrations: number;
  acceptedAbstracts: number;
  pendingRegistrations: number;
  acceptedNoPresentation: number;
  acceptedPresentations: number;
}

const AbstractCharts = ({ data }: { data: Data }) => {
  const chartData = {
    labels: [
      "Completed Registrations with Abstract",
      "Accepted Abstracts",
      "Pending Registrations",
      "Accepted Abstracts with No Presentation",
      "Accepted Presentations",
    ],
    datasets: [
      {
        label: "Count",
        data: [
          data.completedRegistrations,
          data.acceptedAbstracts,
          data.pendingRegistrations,
          data.acceptedNoPresentation,
          data.acceptedPresentations,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
        ],
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">
        Registration and Abstract Status
      </h3>
      <Bar data={chartData} />
    </div>
  );
};

export default AbstractCharts;
