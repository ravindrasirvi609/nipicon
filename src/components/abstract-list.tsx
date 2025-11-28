"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AbstractTable from "./AbstractTable";
import { Abstract, exportAbstractsToExcel } from "@/lib/excelExport";

interface Filters {
  Status: string;
  search: string;
  sortBy: keyof Abstract;
  sortOrder: "asc" | "desc";
}

export function AbstractList() {
  const [abstracts, setAbstracts] = useState<Abstract[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    Status: "all",
    search: "",
    sortBy: "createdAt", // Changed to sort by creation date by default
    sortOrder: "desc", // Changed to descending order to show newest first
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const fetchAbstracts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/abstractList`);
      const data = await response.json();

      if (response.ok) {
        setAbstracts(data.abstracts);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError("An error occurred while fetching abstracts.");
      toast.error("Failed to load abstracts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbstracts();
  }, []);

  const handleStatusUpdate = async (
    abstractId: string,
    newStatus: string,
    comment?: string,
    presentationType?: string
  ) => {
    try {
      const response = await fetch(`/api/updateStatus?id=${abstractId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          _id: abstractId,
          comment,
          presentationType,
        }),
      });

      if (response.ok) {
        setAbstracts((prevAbstracts) =>
          prevAbstracts.map((a) =>
            a._id === abstractId
              ? {
                  ...a,
                  Status: newStatus,
                  presentationType: presentationType || a.presentationType,
                }
              : a
          )
        );
        toast.success(`Status updated to ${newStatus}`);
      } else {
        const data = await response.json();
        throw new Error(data.message);
      }
    } catch (err) {
      toast.error("Failed to update status. Please try again.");
    }
  };

  const handlePresentationStatusUpdate = async (
    abstractId: string,
    newStatus: string,
    comment?: string
  ) => {
    try {
      const response = await fetch(
        `/api/updatePresentationStatus?id=${abstractId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
            _id: abstractId,
            comment,
          }),
        }
      );

      if (response.ok) {
        setAbstracts((prevAbstracts) =>
          prevAbstracts.map((a) =>
            a._id === abstractId
              ? {
                  ...a,
                  presentationFileStatus: newStatus,
                }
              : a
          )
        );
        toast.success(`Presentation status updated to ${newStatus}`);
      } else {
        const data = await response.json();
        throw new Error(data.message);
      }
    } catch (err) {
      toast.error("Failed to update presentation status. Please try again.");
    }
  };

  const handleExportToExcel = () => {
    if (abstracts.length === 0) {
      toast.error("No abstracts to export.");
      return;
    }
    const fileName = `Abstracts_Export_${
      new Date().toISOString().split("T")[0]
    }`;
    exportAbstractsToExcel(abstracts, fileName);
    toast.success("Abstracts exported successfully!");
  };

  const filteredAndSortedAbstracts = useMemo(() => {
    let result = [...abstracts];

    // Apply Status filter
    if (filters.Status !== "all") {
      result = result.filter((abstract) => abstract.Status === filters.Status);
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (abstract) =>
          abstract.title.toLowerCase().includes(searchLower) ||
          abstract.name.toLowerCase().includes(searchLower) ||
          abstract.email.toLowerCase().includes(searchLower) ||
          abstract.temporyAbstractCode.toLowerCase().includes(searchLower) ||
          abstract.AbstractCode?.toLowerCase().includes(searchLower) ||
          abstract.registrationCode?.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      if (a[filters.sortBy] < b[filters.sortBy])
        return filters.sortOrder === "asc" ? -1 : 1;
      if (a[filters.sortBy] > b[filters.sortBy])
        return filters.sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [abstracts, filters]);

  return (
    <div className="flex flex-col h-screen bg-[#F2F2F2]">
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="bg-[#021373] text-white px-6 py-4 flex items-center justify-between shadow-md">
        <h1 className="text-2xl font-bold">Abstract Management</h1>
        <div className="flex items-center gap-4">
          <Link href={"/admin/registrationList"} className="">
            <button className="bg-danger text-white px-4 py-2 text-sm font-medium rounded hover:bg-primary-dark">
              Registration List
            </button>
          </Link>
          <button
            onClick={handleExportToExcel}
            className="bg-pink-500 text-white px-4 py-2 text-sm font-medium rounded hover:bg-green-700 transition duration-300 ease-in-out"
          >
            Export to Excel
          </button>
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="px-4 py-2 bg-[#034C8C] text-white rounded-md text-sm font-medium hover:bg-[#022873] transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#034C8C]"
            >
              Filter
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  {["all", "Pending", "InReview", "Revision", "Accepted"].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setFilters((prev) => ({ ...prev, Status: status }));
                          setIsFilterOpen(false);
                        }}
                        className="block px-4 py-2 text-sm text-[#021373] hover:bg-[#F2F2F2] hover:text-[#034C8C] w-full text-left transition duration-300 ease-in-out"
                        role="menuitem"
                      >
                        {status === "all" ? "All" : status}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
          <input
            type="search"
            placeholder="Search abstracts..."
            className="px-4 py-2 border border-[#CACACA] rounded-md focus:ring-[#034C8C] focus:border-[#034C8C] bg-white text-[#021373]"
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          />
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="px-4 py-2 bg-[#034C8C] text-white rounded-md text-sm font-medium hover:bg-[#022873] transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#034C8C]"
            >
              Sort
            </button>
            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  {["createdAt", "title", "name", "email", "Status"].map(
                    (sortOption) => (
                      <button
                        key={sortOption}
                        onClick={() => {
                          setFilters((prev) => ({
                            ...prev,
                            sortBy: sortOption as keyof Abstract,
                          }));
                          setIsSortOpen(false);
                        }}
                        className="block px-4 py-2 text-sm text-[#021373] hover:bg-[#F2F2F2] hover:text-[#034C8C] w-full text-left transition duration-300 ease-in-out"
                        role="menuitem"
                      >
                        {sortOption === "createdAt"
                          ? "Creation Date"
                          : sortOption.charAt(0).toUpperCase() +
                            sortOption.slice(1)}
                      </button>
                    )
                  )}
                  <hr className="my-1 border-[#CACACA]" />
                  <button
                    onClick={() => {
                      setFilters((prev) => ({
                        ...prev,
                        sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
                      }));
                      setIsSortOpen(false);
                    }}
                    className="block px-4 py-2 text-sm text-[#021373] hover:bg-[#F2F2F2] hover:text-[#034C8C] w-full text-left transition duration-300 ease-in-out"
                    role="menuitem"
                  >
                    {filters.sortOrder === "asc" ? "Descending" : "Ascending"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto py-6">
          <AbstractTable
            abstracts={filteredAndSortedAbstracts}
            loading={loading}
            error={error}
            filters={filters}
            handleStatusUpdate={handleStatusUpdate}
            handlePresentationStatusUpdate={handlePresentationStatusUpdate}
          />
        </div>
      </main>
    </div>
  );
}

export default AbstractList;
