"use client";
import PrivateRoute from "@/components/ui/PrivateRoute";
import { useEffect, useState } from "react";
import { Booking } from "@/types";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import Spinner from "@/components/ui/Spinner";
import toast from "react-hot-toast";
import { Button, Modal, useOverlayState, Table } from "@heroui/react";
import { format, parseISO } from "date-fns";
import Link from "next/link";

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const cancelModal = useOverlayState();

  useEffect(() => {
    if (!user) return;
    api
      .get(`/api/bookings?email=${user.email}`)
      .then((r) => {
        const raw = r.data;
        const list: Booking[] =
          raw?.data?.bookings ?? raw?.bookings ?? (Array.isArray(raw) ? raw : []);
        setBookings(list);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleCancel = async () => {
    if (!cancelId) return;
    try {
      await api.patch(`/api/bookings/${cancelId}/cancel`);
      setBookings((prev) =>
        prev.map((b) =>
          b.id === cancelId ? { ...b, status: "cancelled" } : b,
        ),
      );
      toast.success("Booking cancelled");
      cancelModal.close();
    } catch {
      toast.error("Failed to cancel");
    }
  };

  return (
    <PrivateRoute>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6 dark:text-white">
          My Booked Sessions
        </h1>

        {loading ? (
          <Spinner />
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
            <p className="text-5xl mb-4">📅</p>
            <p className="text-xl font-semibold mb-2 dark:text-white">
              No bookings yet
            </p>
            <p className="text-gray-500 mb-4">
              You haven&apos;t booked any sessions
            </p>
            <Link
              href="/tutors"
              className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse Tutors
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <Table aria-label="My bookings">
              <Table.Header>
                <Table.Column id="tutor">Tutor</Table.Column>
                <Table.Column id="student">Student</Table.Column>
                <Table.Column id="email">Email</Table.Column>
                <Table.Column id="token">Token</Table.Column>
                <Table.Column id="date">Booked At</Table.Column>
                <Table.Column id="status">Status</Table.Column>
                <Table.Column id="action">Action</Table.Column>
              </Table.Header>
              <Table.Body items={bookings}>
                {(b) => (
                  <Table.Row id={b.id}>
                    <Table.Cell className="font-medium dark:text-white">
                      {b.tutor_name}
                    </Table.Cell>
                    <Table.Cell>{b.student_name}</Table.Cell>
                    <Table.Cell className="text-sm text-gray-500">
                      {b.student_email}
                    </Table.Cell>
                    <Table.Cell>
                      <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono">
                        {b.session_token?.slice(0, 8)}…
                      </code>
                    </Table.Cell>
                    <Table.Cell className="text-sm text-gray-500">
                      {format(parseISO(b.booked_at), "dd MMM yyyy")}
                    </Table.Cell>
                    <Table.Cell>
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        b.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-600"
                      }`}>
                        {b.status}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      {b.status === "pending" ? (
                        <Button
                          size="sm"
                          variant="danger-soft"
                          onPress={() => {
                            setCancelId(b.id);
                            cancelModal.open();
                          }}
                        >
                          Cancel
                        </Button>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </div>
        )}

        <Modal state={cancelModal}>
          <Modal.Backdrop>
            <Modal.Container size="sm">
              <Modal.Dialog>
                <Modal.Header>
                  <Modal.Heading>Cancel Booking</Modal.Heading>
                  <Modal.CloseTrigger />
                </Modal.Header>
                <Modal.Body>
                  <p className="text-gray-600 dark:text-gray-300">
                    Are you sure you want to cancel this session?
                  </p>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="ghost" onPress={cancelModal.close}>
                    Keep It
                  </Button>
                  <Button variant="danger" onPress={handleCancel}>
                    Yes, Cancel
                  </Button>
                </Modal.Footer>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      </div>
    </PrivateRoute>
  );
}
