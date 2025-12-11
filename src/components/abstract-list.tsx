"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AbstractTable from "./AbstractTable";
import { Abstract, exportAbstractsToExcel } from "@/lib/excelExport";
import { tracks, getTrackCode } from "@/data";

interface Filters {
  Status: string;
  search: string;
  sortBy: keyof Abstract;
  sortOrder: "asc" | "desc";
  track: string;
  paperType: string;
  presentationType: string;
  isPharmaInnovatorAward: string;
  isForeignDelegate: string;
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
    track: "all",
    paperType: "all",
    presentationType: "all",
    isPharmaInnovatorAward: "all",
    isForeignDelegate: "all",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isTrackFilterOpen, setIsTrackFilterOpen] = useState(false);

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
    const fileName = `Abstracts_Export_${new Date().toISOString().split("T")[0]
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

    // Apply track filter
    if (filters.track !== "all") {
      result = result.filter((abstract) => {
        const trackCode = getTrackCode(abstract.subject);
        return trackCode === filters.track;
      });
    }

    // Apply paper type filter
    if (filters.paperType !== "all") {
      result = result.filter(
        (abstract) =>
          abstract.articleType === filters.paperType ||
          abstract.paperType === filters.paperType
      );
    }

    // Apply presentation type filter
    if (filters.presentationType !== "all") {
      result = result.filter(
        (abstract) => abstract.presentationType === filters.presentationType
      );
    }

    // Apply Pharma Innovator Award filter
    if (filters.isPharmaInnovatorAward !== "all") {
      const isPIA = filters.isPharmaInnovatorAward === "yes";
      result = result.filter(
        (abstract) => abstract.isPharmaInnovatorAward === isPIA
      );
    }

    // Apply Foreign Delegate filter
    if (filters.isForeignDelegate !== "all") {
      const isFD = filters.isForeignDelegate === "yes";
      result = result.filter((abstract) => abstract.isForeignDelegate === isFD);
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

  // Calculate track-wise statistics
  const trackStats = useMemo(() => {
    const stats: Record<
      string,
      { total: number; accepted: number; pending: number; revision: number }
    > = {};

    tracks.forEach((track) => {
      stats[track.code] = { total: 0, accepted: 0, pending: 0, revision: 0 };
    });

    abstracts.forEach((abstract) => {
      const code = getTrackCode(abstract.subject);
      if (stats[code]) {
        stats[code].total++;
        if (abstract.Status === "Accepted") stats[code].accepted++;
        else if (abstract.Status === "Revision") stats[code].revision++;
        else stats[code].pending++;
      }
    });

    return stats;
  }, [abstracts]);

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
          <input
            type="search"
            placeholder="Search abstracts..."
            className="px-4 py-2 border border-[#CACACA] rounded-md focus:ring-[#034C8C] focus:border-[#034C8C] bg-white text-[#021373]"
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          />
        </div>
      </header>

      {/* Track Stats Cards */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {tracks.map((track) => (
            <div
              key={track.code}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${filters.track === track.code
                  ? "ring-2 ring-[#034C8C] bg-blue-50 border-blue-300"
                  : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                }`}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  track: prev.track === track.code ? "all" : track.code,
                }))
              }
            >
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-[#021373]">
                  {track.code}
                </span>
                <span className="text-2xl font-bold text-[#034C8C]">
                  {trackStats[track.code]?.total || 0}
                </span>
              </div>
              <div
                className="text-xs text-gray-600 truncate"
                title={track.label}
              >
                {track.label.substring(3, 30)}...
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-green-600">
                  ✓{trackStats[track.code]?.accepted || 0}
                </span>
                <span className="text-yellow-600">
                  ⏳{trackStats[track.code]?.pending || 0}
                </span>
                <span className="text-red-600">
                  ↻{trackStats[track.code]?.revision || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters Row */}
      <div className="bg-gray-100 px-6 py-3 flex flex-wrap items-center gap-4 border-b">
        {/* Status Filter */}
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="px-4 py-2 bg-[#034C8C] text-white rounded-md text-sm font-medium hover:bg-[#022873] transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#034C8C]"
          >
            Status: {filters.Status === "all" ? "All" : filters.Status}
          </button>
          {isFilterOpen && (
            <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu">
                {["all", "Pending", "InReview", "Revision", "Accepted"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setFilters((prev) => ({ ...prev, Status: status }));
                        setIsFilterOpen(false);
                      }}
                      className="block px-4 py-2 text-sm text-[#021373] hover:bg-[#F2F2F2] w-full text-left"
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

        {/* Track Filter */}
        <div className="relative">
          <button
            onClick={() => setIsTrackFilterOpen(!isTrackFilterOpen)}
            className="px-4 py-2 bg-[#034C8C] text-white rounded-md text-sm font-medium hover:bg-[#022873] transition duration-300"
          >
            Track: {filters.track === "all" ? "All" : filters.track}
          </button>
          {isTrackFilterOpen && (
            <div className="absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu">
                <button
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, track: "all" }));
                    setIsTrackFilterOpen(false);
                  }}
                  className="block px-4 py-2 text-sm text-[#021373] hover:bg-[#F2F2F2] w-full text-left"
                >
                  All Tracks
                </button>
                {tracks.map((track) => (
                  <button
                    key={track.code}
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, track: track.code }));
                      setIsTrackFilterOpen(false);
                    }}
                    className="block px-4 py-2 text-sm text-[#021373] hover:bg-[#F2F2F2] w-full text-left"
                  >
                    {track.code} - {track.label.substring(3, 40)}...
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Paper Type Filter */}
        <select
          value={filters.paperType}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, paperType: e.target.value }))
          }
          className="px-3 py-2 border rounded-md text-sm text-black bg-white"
        >
          <option value="all">All Paper Types</option>
          <option value="Research">Research</option>
          <option value="Review">Review</option>
        </select>

        {/* Presentation Type Filter */}
        <select
          value={filters.presentationType}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              presentationType: e.target.value,
            }))
          }
          className="px-3 py-2 border rounded-md text-sm text-black bg-white"
        >
          <option value="all">All Presentation Types</option>
          <option value="Oral">Oral</option>
          <option value="Poster">Poster</option>
        </select>

        {/* Special Filters */}
        <select
          value={filters.isPharmaInnovatorAward}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              isPharmaInnovatorAward: e.target.value,
            }))
          }
          className="px-3 py-2 border rounded-md text-sm text-black bg-white"
        >
          <option value="all">All (PIA)</option>
          <option value="yes">Pharma Innovator Award</option>
          <option value="no">Regular Abstracts</option>
        </select>

        <select
          value={filters.isForeignDelegate}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              isForeignDelegate: e.target.value,
            }))
          }
          className="px-3 py-2 border rounded-md text-sm text-black bg-white"
        >
          <option value="all">All Delegates</option>
          <option value="yes">Foreign Delegates</option>
          <option value="no">Indian Delegates</option>
        </select>

        {/* Sort */}
        <div className="relative ml-auto">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="px-4 py-2 bg-[#034C8C] text-white rounded-md text-sm font-medium hover:bg-[#022873] transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#034C8C]"
          >
            Sort
          </button>
          {isSortOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu">
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
                      className="block px-4 py-2 text-sm text-[#021373] hover:bg-[#F2F2F2] w-full text-left"
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
                  className="block px-4 py-2 text-sm text-[#021373] hover:bg-[#F2F2F2] w-full text-left"
                  role="menuitem"
                >
                  {filters.sortOrder === "asc" ? "Descending" : "Ascending"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-bold">{filteredAndSortedAbstracts.length}</span>{" "}
          of <span className="font-bold">{abstracts.length}</span> abstracts
        </div>
      </div>
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
