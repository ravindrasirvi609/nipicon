"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardCharts from "@/components/DashboardCharts";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaFileAlt,
  FaMoneyCheckAlt,
  FaHourglassHalf,
} from "react-icons/fa";
import LoadingExample from "@/components/Loader";
import AbstractCharts from "@/components/AbstractCharts";
import { Abstract } from "@/lib/excelExport";
import GroupRegistrationChart from "@/components/GroupRegistrationChart";

// Define types for the dashboard data
interface DashboardStats {
  totalRegistrations: number;
  totalAbstracts: number;
  completedPayments: number;
  pendingPayments: number;
}

interface DashboardChartsProps {
  data: {
    paymentStatus: { completed: number; pending: number; failed: number };
    abstractStatus: { [key: string]: number };
    registrationTypes: { [key: string]: number };
    monthlyRegistrations: { [key: string]: number };
  };
}

interface Registration {
  id: string;
  name: string;
  email: string;
  registrationType: string;
  registrationStatus: string;
}

interface DashboardData {
  stats: DashboardStats;
  chartData: DashboardChartsProps["data"];
  recentRegistrations: Registration[];
}

// Add this interface to your existing interfaces
interface TotalAmountData {
  totalAmount: number;
  totalCompletedRegistrations: number;
  typeWiseSummary: {
    _id: string;
    count: number;
    amount: number;
  }[];
}

// Add this to your existing interfaces
interface GroupData {
  _id: string;
  count: number;
  totalAmount: number;
  completedPayments: number;
}

// Utility components
const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
}> = ({ title, value, icon }) => (
  <motion.div
    className="bg-white/30 backdrop-blur-lg rounded-xl p-6 border border-white/30 shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all duration-300"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
        <p className="mt-2 text-3xl font-bold text-indigo-600">{value}</p>
      </div>
      <div className="text-3xl text-indigo-500/80 p-3 bg-white/30 rounded-lg">
        {icon}
      </div>
    </div>
  </motion.div>
);

function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [abstracts, setAbstracts] = useState<Abstract[]>([]);
  const [totalAmountData, setTotalAmountData] =
    useState<TotalAmountData | null>(null);
  const [groupData, setGroupData] = useState<GroupData[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.post<DashboardData>("/api/dashboard", {
          startDate: "2023-01-01", // Adjust these dates as needed
          endDate: "2025-12-31",
        });
        setDashboardData(response.data);
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
    fetchAbstracts();
    fetchTotalAmount();
    fetchGroupData();
  }, []);

  const fetchAbstracts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/abstractList`);
      const data = await response.json();

      if (response.ok) {
        setAbstracts(data.abstracts);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError("An error occurred while fetching abstracts.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTotalAmount = async () => {
    try {
      const response = await fetch("/api/registration/totalAmount");
      const data = await response.json();
      if (data.success) {
        setTotalAmountData(data.data);
      }
    } catch (error) {
      console.error("Error fetching total amount:", error);
    }
  };

  const fetchGroupData = async () => {
    try {
      const response = await fetch("/api/registration/groupCount");
      const data = await response.json();
      if (data.success) {
        setGroupData(data.data);
      }
    } catch (error) {
      console.error("Error fetching group data:", error);
    }
  };

  // Calculate the required data for the charts
  const completedRegistrations = abstracts.filter(
    (abstract) => abstract.registrationCompleted
  ).length;

  const acceptedAbstracts = abstracts.filter(
    (abstract) => abstract.Status === "Accepted"
  ).length;

  const pendingRegistrations = abstracts.filter(
    (abstract) => !abstract.registrationCompleted
  ).length;

  const acceptedNoPresentation = abstracts.filter(
    (abstract) =>
      abstract.Status === "Accepted" && !abstract.presentationFileUrl
  ).length;

  const acceptedPresentations = abstracts.filter(
    (abstract) => abstract.presentationFileStatus === "Approved"
  ).length;

  const dashboardChartData = {
    completedRegistrations,
    acceptedAbstracts,
    pendingRegistrations,
    acceptedNoPresentation,
    acceptedPresentations,
  };

  if (isLoading)
    return (
      <div>
        {" "}
        <LoadingExample />
      </div>
    );
  if (error) return <div>Error: {error}</div>;
  if (!dashboardData) return null;

  const { stats, chartData, recentRegistrations } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">
            Conference Dashboard
          </h1>
          <nav className="flex space-x-3">
            {[
              "abstract List",
              "registration List",
              "nomination List",
              "analytics",
              "contact List",
            ].map((item) => (
              <Link
                key={item}
                href={`/admin/${item.replace(" ", "")}`}
                className="text-slate-600 hover:bg-white/50 px-4 py-2 rounded-lg text-sm font-medium transition duration-300 border border-transparent hover:border-slate-200"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Statistics Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 px-4">
            <StatCard
              title="Total Registrations"
              value={stats.totalRegistrations}
              icon={<FaUsers />}
            />
            <StatCard
              title="Total Abstracts"
              value={stats.totalAbstracts}
              icon={<FaFileAlt />}
            />
            <StatCard
              title="Completed Payments"
              value={stats.completedPayments}
              icon={<FaMoneyCheckAlt />}
            />
            <StatCard
              title="Pending Payments"
              value={stats.pendingPayments}
              icon={<FaHourglassHalf />}
            />
          </div>

          {/* Charts Section */}
          <motion.div
            className="mt-8 bg-white/30 backdrop-blur-lg rounded-xl border border-white/30 shadow-lg shadow-indigo-100/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <DashboardCharts data={chartData} />
          </motion.div>
          <AbstractCharts data={dashboardChartData} />

          {/* Recent Registrations Table */}
          <motion.div
            className="mt-8 bg-white/30 backdrop-blur-lg rounded-xl border border-white/30 shadow-lg shadow-indigo-100/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <div className="px-6 py-4 border-b border-white/30">
              <h2 className="text-lg font-semibold text-slate-700">
                Recent Registrations
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/40">
                  <tr>
                    {["Name", "Email", "Type", "Status"].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-sm font-medium text-slate-600"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/20">
                  {recentRegistrations.map((registration) => (
                    <motion.tr
                      key={registration.id}
                      className="hover:bg-white/30 transition-colors duration-200"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                        {registration.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {registration.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {registration.registrationType}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            registration.registrationStatus === "Confirmed"
                              ? "bg-green text-white"
                              : "bg-amber-100/50 text-amber-700"
                          }`}
                        >
                          {registration.registrationStatus}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Add Registration Type Summary */}
          <motion.div
            className="mt-8 bg-white/30 backdrop-blur-lg rounded-xl border border-white/30 shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h2 className="text-lg font-semibold text-slate-700 mb-4">
              Registration Type Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                key={"total"}
                className="bg-white/50 rounded-lg p-4 shadow-sm"
              >
                <h3 className="text-md font-medium text-slate-600">
                  {"Total"}
                </h3>
                <div className="mt-2 flex justify-between">
                  <span className="text-sm text-slate-500">
                    Count: {totalAmountData?.totalCompletedRegistrations}
                  </span>
                  <span className="text-sm font-medium text-indigo-600">
                    ₹{totalAmountData?.totalAmount}
                  </span>
                </div>
              </div>
              {totalAmountData?.typeWiseSummary.map((type) => (
                <div
                  key={type._id}
                  className="bg-white/50 rounded-lg p-4 shadow-sm"
                >
                  <h3 className="text-md font-medium text-slate-600">
                    {type._id || "Unknown"}
                  </h3>
                  <div className="mt-2 flex justify-between">
                    <span className="text-sm text-slate-500">
                      Count: {type.count}
                    </span>
                    <span className="text-sm font-medium text-indigo-600">
                      ₹{type.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Group Registration Summary */}
          <motion.div
            className="mt-8 bg-white/30 backdrop-blur-lg rounded-xl border border-white/30 shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h2 className="text-lg font-semibold text-slate-700 mb-4">
              Group Registration Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {groupData.map((group) => (
                <div
                  key={group._id}
                  className="bg-white/50 rounded-lg p-4 shadow-sm"
                >
                  <h3 className="text-md font-medium text-slate-600">
                    {group._id || "No Group"}
                  </h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">
                        Total Registrations:
                      </span>
                      <span className="text-sm font-medium text-indigo-600">
                        {group.count}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">
                        Completed Payments:
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        {group.completedPayments}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">
                        Total Amount:
                      </span>
                      <span className="text-sm font-medium text-indigo-600">
                        ₹{group.totalAmount}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <GroupRegistrationChart groupData={groupData} />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

export default Dashboard;
