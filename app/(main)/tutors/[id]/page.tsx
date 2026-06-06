"use client";
import { useEffect, useState, use } from "react";
import { Tutor } from "@/types";
import api from "@/lib/axios";
import Spinner from "@/components/ui/Spinner";
import PrivateRoute from "@/components/ui/PrivateRoute";
import { Button, Modal, useOverlayState } from "@heroui/react";
import FormField from "@/components/ui/FormField";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { format, isBefore, parseISO } from "date-fns";
import Image from "next/image";

export default function TutorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const modalState = useOverlayState();
  const [phone, setPhone] = useState("");
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    api
      .get(`/api/tutors/${id}`)
      .then((r) => {
        // handle { success, data: { tutor: {} } } or { data: {} } or direct object
        const raw = r.data;
        const t: Tutor = raw?.data?.tutor ?? raw?.tutor ?? raw?.data ?? raw;
        setTutor(t);
      })
      .catch(() => setTutor(null))
      .finally(() => setLoading(false));
  }, [id]);

  const canBook = () => {
    if (!tutor) return { ok: false, msg: "" };
    if (tutor.total_slot <= 0)
      return { ok: false, msg: "No available slots left." };
    const sessionDate = parseISO(tutor.session_start_date);
    if (isBefore(new Date(), sessionDate))
      return {
        ok: false,
        msg: `Booking not available yet. Session starts ${format(sessionDate, "dd MMM yyyy")}.`,
      };
    return { ok: true, msg: "" };
  };

  const handleBook = async () => {
    if (!user || !tutor) return;
    setBooking(true);
    try {
      await api.post("/api/bookings", {
        tutor_id: tutor.id,
        tutor_name: tutor.name,
        student_name: user.name,
        student_email: user.email,
        phone,
      });
      setTutor((prev) =>
        prev ? { ...prev, total_slot: prev.total_slot - 1 } : prev,
      );
      toast.success("Session booked! Check My Bookings for your token.");
      modalState.close();
      setPhone("");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string; error?: string } } })
          ?.response?.data?.message ||
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ||
        "Booking failed";
      toast.error(msg);
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <Spinner />;
  if (!tutor)
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">❌</p>
        <p className="text-xl font-semibold dark:text-white">Tutor not found</p>
      </div>
    );

  const { ok, msg } = canBook();
  const fee =
    typeof tutor.hourly_fee === "string"
      ? parseFloat(tutor.hourly_fee)
      : tutor.hourly_fee;
  const days = tutor.available_days
    ?.toString()
    .replace(/[{}"]/g, "")
    .replace(/,/g, ", ");

  return (
    <PrivateRoute>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="relative w-48 h-48 shrink-0">
            <Image
              src={tutor.photo || "https://i.pravatar.cc/192"}
              alt={tutor.name}
              fill
              className="rounded-2xl object-cover"
              sizes="192px"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1 dark:text-white">
              {tutor.name}
            </h1>
            <p className="text-gray-500 mb-3">{tutor.institution}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {tutor.subject}
              </span>
              <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {tutor.teaching_mode}
              </span>
              <span
                className={`px-3 py-1 text-sm rounded-full font-medium ${
                  tutor.total_slot > 0
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300"
                }`}
              >
                {tutor.total_slot > 0
                  ? `${tutor.total_slot} slots available`
                  : "Fully booked"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-6">
              {[
                { label: "Available", val: `${days} · ${tutor.available_time}` },
                { label: "Location", val: `📍 ${tutor.location}` },
                {
                  label: "Session Start",
                  val: format(parseISO(tutor.session_start_date), "dd MMM yyyy"),
                },
                { label: "Experience", val: `${tutor.experience} yrs` },
              ].map(({ label, val }) => (
                <div
                  key={label}
                  className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <p className="text-gray-400 text-xs mb-1">{label}</p>
                  <p className="font-medium dark:text-white">{val}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-bold text-blue-600">
                ৳{fee}
                <span className="text-base font-normal text-gray-500">/hr</span>
              </span>
            </div>

            {!ok && msg && (
              <p className="text-red-500 text-sm mb-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                {msg}
              </p>
            )}

            <Button
              variant="primary"
              size="lg"
              isDisabled={!ok}
              onPress={modalState.open}
            >
              Book Session
            </Button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal state={modalState}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Heading>
                  Book a Session with {tutor.name}
                </Modal.Heading>
                <Modal.CloseTrigger />
              </Modal.Header>
              <Modal.Body className="flex flex-col gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Student Name
                  </label>
                  <input
                    value={user?.name || ""}
                    readOnly
                    className="w-full mt-1 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    value={user?.email || ""}
                    readOnly
                    className="w-full mt-1 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Tutor
                  </label>
                  <input
                    value={tutor.name}
                    readOnly
                    className="w-full mt-1 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm dark:text-white"
                  />
                </div>
                <FormField
                  label="Phone Number"
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="ghost" onPress={modalState.close}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  isDisabled={!phone.trim() || booking}
                  onPress={handleBook}
                >
                  {booking ? "Booking..." : "Confirm Booking"}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </PrivateRoute>
  );
}
