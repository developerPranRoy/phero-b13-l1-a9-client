"use client";
import { useEffect, useState, useCallback } from "react";
import { Tutor } from "@/types";
import api from "@/lib/axios";
import TutorCard from "@/components/tutors/TutorCard";
import Spinner from "@/components/ui/Spinner";
import { Button } from "@heroui/react";

export default function TutorsPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchTutors = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);
      const { data } = await api.get(`/api/tutors?${params}`);
      const raw = data;
      const list = Array.isArray(raw)
        ? raw
        : raw.tutors ?? raw.data ?? [];
      setTutors(list);
    } catch {
      setTutors([]);
    } finally {
      setLoading(false);
    }
  }, [search, startDate, endDate]);

  useEffect(() => {
    const t = setTimeout(fetchTutors, 400);
    return () => clearTimeout(t);
  }, [fetchTutors]);

  const clearFilters = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Find a Tutor</h1>

      <div className="flex flex-wrap gap-3 items-end mb-8">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            Search by name
          </label>
          <input
            type="text"
            placeholder="Search tutors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            Session start (from)
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            Session start (to)
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {(search || startDate || endDate) && (
          <Button variant="ghost" onPress={clearFilters} size="sm">
            Clear filters
          </Button>
        )}
      </div>

      {loading ? (
        <Spinner />
      ) : tutors.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">😕</p>
          <p className="text-xl font-semibold mb-2 dark:text-white">
            No tutors found
          </p>
          <p className="text-gray-500 mb-4">
            Try adjusting your search or filters
          </p>
          {(search || startDate || endDate) && (
            <Button onPress={clearFilters} variant="outline">
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <>
          <p className="text-gray-500 text-sm mb-4">
            {tutors.length} tutor{tutors.length !== 1 && "s"} found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((t) => (
              <TutorCard key={t._id} tutor={t} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
