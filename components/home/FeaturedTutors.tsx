"use client";
import { useEffect, useState } from "react";
import { Tutor } from "@/types";
import api from "@/lib/axios";
import TutorCard from "@/components/tutors/TutorCard";
import Spinner from "@/components/ui/Spinner";
import Link from "next/link";

export default function FeaturedTutors() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/tutors?limit=6")
      .then((res) => {
        const raw = res.data;
        const list: Tutor[] =
          raw?.data?.tutors ?? raw?.tutors ?? (Array.isArray(raw) ? raw : []);
        setTutors(list);
      })
      .catch(() => setTutors([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2 dark:text-white">
          Available Tutors
        </h2>
        <p className="text-gray-500">
          Hand-picked experts ready to guide your learning journey
        </p>
      </div>

      {loading ? (
        <Spinner />
      ) : tutors.length === 0 ? (
        <p className="text-center text-gray-500 py-12">
          No tutors available yet. Be the first to{" "}
          <Link href="/add-tutor" className="text-blue-600 underline">
            add one
          </Link>
          !
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors.map((t) => (
            <TutorCard key={t.id} tutor={t} />
          ))}
        </div>
      )}

      <div className="text-center mt-10">
        <Link
          href="/tutors"
          className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        >
          View All Tutors →
        </Link>
      </div>
    </section>
  );
}
