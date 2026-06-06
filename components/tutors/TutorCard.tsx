"use client";
import { Tutor } from "@/types";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function TutorCard({ tutor }: { tutor: Tutor }) {
  const router = useRouter();
  const slots = tutor.total_slot;
  const fee = typeof tutor.hourly_fee === "string"
    ? parseFloat(tutor.hourly_fee)
    : tutor.hourly_fee;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 pb-2">
        <div className="relative w-14 h-14 shrink-0">
          <Image
            src={tutor.photo || "https://i.pravatar.cc/56"}
            alt={tutor.name}
            fill
            className="rounded-full object-cover"
            sizes="56px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-base truncate dark:text-white">{tutor.name}</h3>
          <p className="text-xs text-gray-500 truncate">{tutor.institution}</p>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 px-4 py-2 flex flex-col gap-2">
        <div className="flex flex-wrap gap-1">
          <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            {tutor.subject}
          </span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            {tutor.teaching_mode}
          </span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <p>🕐 {tutor.available_days?.toString().replace(/[{}"]/g, "").replace(/,/g, ", ")} · {tutor.available_time}</p>
          <p>📍 {tutor.location}</p>
          <p>💼 {tutor.experience} yrs experience</p>
        </div>
        <div className="flex justify-between items-center mt-auto pt-2">
          <span className="font-bold text-blue-600 text-lg">
            ৳{fee}<span className="text-xs font-normal text-gray-500">/hr</span>
          </span>
          <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
            slots > 0
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
              : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300"
          }`}>
            {slots > 0 ? `${slots} slots` : "Full"}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 pt-2">
        <button
          onClick={() => router.push(`/tutors/${tutor.id}`)}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Book Session
        </button>
      </div>
    </div>
  );
}
