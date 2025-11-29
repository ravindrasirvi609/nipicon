"use client";
import LoadingExample from "@/components/Loader";
import RegistrationTable from "@/components/RegistrationTable";
import { exportToExcel } from "@/lib/excelExport";
import { registrationCategories, bankDetails, getCategoryCode } from "@/data";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";

interface Registration {
  _id: string;
  registrationType: string;
  paymentStatus: string;
  registrationStatus: string;
  [key: string]: unknown;
}

export default function RegistrationList() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<
    Registration[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch("/api/registrationsList");
      const data = await response.json();
      setRegistrations(data);
      setFilteredRegistrations(data);
    } catch (error) {
      console.error("Failed to fetch registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  useEffect(() => {
    let filtered = registrations.filter((registration) =>
      Object.values(registration).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((reg) => {
        const regCode = getCategoryCode(reg.registrationType);
        return regCode === categoryFilter;
      });
    }

    // Apply payment filter
    if (paymentFilter !== "all") {
      filtered = filtered.filter((reg) => reg.paymentStatus === paymentFilter);
    }

    setFilteredRegistrations(filtered);
  }, [searchTerm, registrations, categoryFilter, paymentFilter]);

  // Calculate category-wise statistics
  const categoryStats = useMemo(() => {
    const stats: Record<
      string,
      { count: number; completed: number; pending: number }
    > = {};

    registrationCategories.forEach((cat) => {
      stats[cat.code] = { count: 0, completed: 0, pending: 0 };
    });

    registrations.forEach((reg) => {
      const code = getCategoryCode(reg.registrationType);
      if (stats[code]) {
        stats[code].count++;
        if (reg.paymentStatus === "Completed") {
          stats[code].completed++;
        } else {
          stats[code].pending++;
        }
      }
    });

    return stats;
  }, [registrations]);

  // Handle registration confirmation
  const handleConfirm = async (registrationId: string) => {
    try {
      const response = await fetch("/api/updateRegistrationStatus", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registrationId,
          action: "confirm",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNotification({
          type: "success",
          message: `Registration confirmed! Code: ${data.registrationCode}`,
        });
        // Refresh the list
        await fetchRegistrations();
      } else {
        setNotification({
          type: "error",
          message: data.error || "Failed to confirm registration",
        });
      }
    } catch (error) {
      console.error("Error confirming registration:", error);
      setNotification({
        type: "error",
        message: "Failed to confirm registration",
      });
    }

    // Auto-hide notification after 5 seconds
    setTimeout(() => setNotification(null), 5000);
  };

  // Handle registration rejection
  const handleReject = async (registrationId: string, reason: string) => {
    try {
      const response = await fetch("/api/updateRegistrationStatus", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registrationId,
          action: "reject",
          rejectionReason: reason,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNotification({
          type: "success",
          message: "Registration rejected. Email sent to user.",
        });
        // Refresh the list
        await fetchRegistrations();
      } else {
        setNotification({
          type: "error",
          message: data.error || "Failed to reject registration",
        });
      }
    } catch (error) {
      console.error("Error rejecting registration:", error);
      setNotification({
        type: "error",
        message: "Failed to reject registration",
      });
    }

    // Auto-hide notification after 5 seconds
    setTimeout(() => setNotification(null), 5000);
  };

  const handleExport = () => {
    exportToExcel(filteredRegistrations as never[], "Registrations");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (loading)
    return (
      <div>
        {" "}
        <LoadingExample />
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${
            notification.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          <div className="flex items-center space-x-2">
            <span>{notification.type === "success" ? "✓" : "✕"}</span>
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-4 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-900">Registration List</h1>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search registrations..."
            value={searchTerm}
            onChange={handleSearch}
            className="px-4 py-2 border border-gray-300 text-gray-900 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleExport}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Export to Excel
          </button>
          <Link href={"/admin/abstractList"}>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Abstract List
            </button>
          </Link>
        </div>
      </div>

      {/* Category Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
        {registrationCategories.slice(0, 8).map((cat) => (
          <div
            key={cat.code + cat.value}
            className={`p-4 rounded-lg shadow cursor-pointer transition-all ${
              categoryFilter === cat.code
                ? "ring-2 ring-blue-500 bg-blue-50"
                : "bg-white hover:bg-gray-50"
            }`}
            onClick={() =>
              setCategoryFilter(categoryFilter === cat.code ? "all" : cat.code)
            }
          >
            <div className="text-xs font-semibold text-gray-500">
              {cat.code}
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {categoryStats[cat.code]?.count || 0}
            </div>
            <div className="text-xs text-gray-600 truncate">
              {cat.label.split(" ")[0]}
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-green-600">
                ✓ {categoryStats[cat.code]?.completed || 0}
              </span>
              <span className="text-yellow-600">
                ⏳ {categoryStats[cat.code]?.pending || 0}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-4 mb-6 items-center bg-white p-4 rounded-lg shadow">
        <div>
          <label className="text-sm font-medium text-gray-700 mr-2">
            Category:
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {registrationCategories.map((cat) => (
              <option key={cat.value} value={cat.code}>
                {cat.code} - {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mr-2">
            Payment:
          </label>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Payments</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <button
          onClick={() => setShowBankDetails(!showBankDetails)}
          className="ml-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showBankDetails ? "Hide" : "Show"} Bank Details
        </button>

        <div className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-bold">{filteredRegistrations.length}</span> of{" "}
          <span className="font-bold">{registrations.length}</span>{" "}
          registrations
        </div>
      </div>

      {/* Bank Details Panel */}
      {showBankDetails && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-blue-800 mb-4">
            Bank Account Details for Registration Fees Payment
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-semibold text-gray-700">Account Name:</span>
              <p className="text-gray-900">{bankDetails.accountName}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Bank Name:</span>
              <p className="text-gray-900">{bankDetails.bankName}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Branch Name:</span>
              <p className="text-gray-900">{bankDetails.branchName}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Account No:</span>
              <p className="text-gray-900 font-mono">{bankDetails.accountNo}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">IFSC Code:</span>
              <p className="text-gray-900 font-mono">{bankDetails.ifscCode}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">MICR Code:</span>
              <p className="text-gray-900 font-mono">{bankDetails.micrCode}</p>
            </div>
          </div>
        </div>
      )}

      <RegistrationTable
        registrations={filteredRegistrations as never[]}
        onConfirm={handleConfirm}
        onReject={handleReject}
        showActions={true}
      />
    </div>
  );
}
