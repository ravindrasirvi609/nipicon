"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingExample from "./Loader";

interface PaginationProps {
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  total,
  page,
  limit,
  onPageChange,
}) => {
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <Button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        variant="outline"
      >
        Previous
      </Button>
      <span className="mx-4">
        Page {page} of {totalPages}
      </span>
      <Button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        variant="outline"
      >
        Next
      </Button>
    </div>
  );
};

interface UserClicksTableProps {
  period: string;
  onPeriodChange: (period: string) => void;
}

export const UserClicksTable: React.FC<UserClicksTableProps> = ({
  period,
  onPeriodChange,
}) => {
  const [clicks, setClicks] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 10;

  useEffect(() => {
    const fetchClicks = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/analytics/clicks?period=${period}&page=${page}&limit=${limit}`
        );
        const data = await response.json();
        setClicks(data.clicks);
        setTotal(data.pagination.total);
      } catch (error) {
        console.error("Failed to fetch clicks:", error);
      }
      setLoading(false);
    };

    fetchClicks();
  }, [period, page]);

  if (loading) {
    return (
      <div>
        {" "}
        <LoadingExample />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Clicks</h2>
        <Select value={period} onValueChange={onPeriodChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 Hours</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Page</TableHead>
            <TableHead>Element</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clicks.map((click, index) => (
            <TableRow key={index}>
              <TableCell>{click.page}</TableCell>
              <TableCell>
                {click.elementText ||
                  click.elementId ||
                  click.elementClass ||
                  "N/A"}
              </TableCell>
              <TableCell>
                x: {click.xPosition}, y: {click.yPosition}
              </TableCell>
              <TableCell>
                {new Date(click.timestamp).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        total={total}
        page={page}
        limit={limit}
        onPageChange={setPage}
      />
    </div>
  );
};

interface UserEventsTableProps {
  period: string;
  onPeriodChange: (period: string) => void;
}

export const UserEventsTable: React.FC<UserEventsTableProps> = ({
  period,
  onPeriodChange,
}) => {
  const [events, setEvents] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 10;

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/analytics/events?period=${period}&page=${page}&limit=${limit}`
        );
        const data = await response.json();
        setEvents(data.events);
        setTotal(data.pagination.total);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
      setLoading(false);
    };

    fetchEvents();
  }, [period, page]);

  if (loading) {
    return (
      <div>
        {" "}
        <LoadingExample />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Events</h2>
        <Select value={period} onValueChange={onPeriodChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 Hours</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Page</TableHead>
            <TableHead>Event Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event, index) => (
            <TableRow key={index}>
              <TableCell>{event.page}</TableCell>
              <TableCell>{event.eventType}</TableCell>
              <TableCell>{event.eventCategory || "N/A"}</TableCell>
              <TableCell>{event.eventAction || "N/A"}</TableCell>
              <TableCell>{event.eventLabel || "N/A"}</TableCell>
              <TableCell>{event.eventValue || "N/A"}</TableCell>
              <TableCell>
                {new Date(event.timestamp).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        total={total}
        page={page}
        limit={limit}
        onPageChange={setPage}
      />
    </div>
  );
};
