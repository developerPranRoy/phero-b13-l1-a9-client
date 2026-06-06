"use client";
import PrivateRoute from "@/components/ui/PrivateRoute";
import { useEffect, useState } from "react";
import { Tutor } from "@/types";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import Spinner from "@/components/ui/Spinner";
import toast from "react-hot-toast";
import {
  Button,
  Chip,
  Modal,
  useOverlayState,
  Table,
  ListBox,
  ListBoxItem,
  Select,
} from "@heroui/react";
import FormField from "@/components/ui/FormField";
import Image from "next/image";
import Link from "next/link";

const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Bengali",
  "History",
  "Geography",
  "Computer Science",
  "Economics",
  "Accounting",
  "Music",
  "Art",
];
const MODES = ["Online", "Offline", "Both"];

export default function MyTutorsPage() {
  const { user } = useAuth();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Tutor | null>(null);
  const [delTarget, setDelTarget] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Tutor>>({});
  const editModal = useOverlayState();
  const delModal = useOverlayState();

  useEffect(() => {
    if (!user) return;
    api
      .get(`/api/tutors?createdBy=${user.email}&all=true`)
      .then((r) => setTutors(r.data.tutors || []))
      .finally(() => setLoading(false));
  }, [user]);

  const openEdit = (t: Tutor) => {
    setSelected(t);
    setForm(t);
    editModal.open();
  };

  const handleUpdate = async () => {
    if (!selected) return;
    try {
      const { data } = await api.put(`/api/tutors/${selected._id}`, form);
      setTutors((prev) =>
        prev.map((t) => (t._id === selected._id ? data.tutor : t)),
      );
      toast.success("Tutor updated!");
      editModal.close();
    } catch {
      toast.error("Update failed");
    }
  };

  const handleDelete = async () => {
    if (!delTarget) return;
    try {
      await api.delete(`/api/tutors/${delTarget}`);
      setTutors((prev) => prev.filter((t) => t._id !== delTarget));
      toast.success("Tutor deleted");
      delModal.close();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <PrivateRoute>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6 dark:text-white">My Tutors</h1>

        {loading ? (
          <Spinner />
        ) : tutors.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
            <p className="text-5xl mb-4">📋</p>
            <p className="text-xl font-semibold mb-2 dark:text-white">
              No tutors yet
            </p>
            <p className="text-gray-500 mb-4">
              You haven&apos;t added any tutors
            </p>
            <Link
              href="/add-tutor"
              className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Add Your First Tutor
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <Table aria-label="My tutors">
              <Table.Header>
                <Table.Column id="tutor">Tutor</Table.Column>
                <Table.Column id="subject">Subject</Table.Column>
                <Table.Column id="mode">Mode</Table.Column>
                <Table.Column id="slots">Slots</Table.Column>
                <Table.Column id="fee">Fee</Table.Column>
                <Table.Column id="actions">Actions</Table.Column>
              </Table.Header>
              <Table.Body items={tutors}>
                {(t) => (
                  <Table.Row id={t._id}>
                    <Table.Cell>
                      <div className="flex items-center gap-2">
                        <div className="relative w-9 h-9 shrink-0">
                          <Image
                            src={t.photo || "https://i.pravatar.cc/36"}
                            alt={t.name}
                            fill
                            className="rounded-full object-cover"
                            sizes="36px"
                          />
                        </div>
                        <span className="font-medium dark:text-white">
                          {t.name}
                        </span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Chip size="sm" variant="soft" color="accent">
                        {t.subject}
                      </Chip>
                    </Table.Cell>
                    <Table.Cell>{t.teachingMode}</Table.Cell>
                    <Table.Cell>
                      <Chip
                        size="sm"
                        color={t.totalSlot > 0 ? "success" : "danger"}
                        variant="soft"
                      >
                        {t.totalSlot}
                      </Chip>
                    </Table.Cell>
                    <Table.Cell>৳{t.hourlyFee}/hr</Table.Cell>
                    <Table.Cell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onPress={() => openEdit(t)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger-soft"
                          onPress={() => {
                            setDelTarget(t._id);
                            delModal.open();
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </div>
        )}

        {/* Edit Modal */}
        <Modal state={editModal}>
          <Modal.Backdrop>
            <Modal.Container size="lg">
              <Modal.Dialog>
                <Modal.Header>
                  <Modal.Heading>Edit Tutor</Modal.Heading>
                  <Modal.CloseTrigger />
                </Modal.Header>
                <Modal.Body className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField
                    label="Name"
                    value={form.name || ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                  />
                  <FormField
                    label="Photo URL"
                    value={form.photo || ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, photo: e.target.value }))
                    }
                  />

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Subject</label>
                    <Select
                      selectedKey={form.subject}
                      onSelectionChange={(k) =>
                        setForm((f) => ({ ...f, subject: k as string }))
                      }
                      aria-label="Subject"
                    >
                      <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {SUBJECTS.map((s) => (
                            <ListBoxItem key={s} id={s}>
                              {s}
                            </ListBoxItem>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Teaching Mode</label>
                    <Select
                      selectedKey={form.teachingMode}
                      onSelectionChange={(k) =>
                        setForm((f) => ({
                          ...f,
                          teachingMode: k as "Online" | "Offline" | "Both",
                        }))
                      }
                      aria-label="Mode"
                    >
                      <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {MODES.map((m) => (
                            <ListBoxItem key={m} id={m}>
                              {m}
                            </ListBoxItem>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  <FormField
                    label="Available Days"
                    value={form.availableDays || ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, availableDays: e.target.value }))
                    }
                  />
                  <FormField
                    label="Available Time"
                    value={form.availableTime || ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, availableTime: e.target.value }))
                    }
                  />
                  <FormField
                    label="Hourly Fee"
                    type="number"
                    value={String(form.hourlyFee || "")}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        hourlyFee: Number(e.target.value),
                      }))
                    }
                  />
                  <FormField
                    label="Total Slots"
                    type="number"
                    value={String(form.totalSlot || "")}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        totalSlot: Number(e.target.value),
                      }))
                    }
                  />
                  <FormField
                    label="Institution"
                    value={form.institution || ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, institution: e.target.value }))
                    }
                  />
                  <FormField
                    label="Experience"
                    value={form.experience || ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, experience: e.target.value }))
                    }
                  />
                  <FormField
                    label="Location"
                    value={form.location || ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, location: e.target.value }))
                    }
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="ghost" onPress={editModal.close}>
                    Cancel
                  </Button>
                  <Button variant="primary" onPress={handleUpdate}>
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>

        {/* Delete Confirm Modal */}
        <Modal state={delModal}>
          <Modal.Backdrop>
            <Modal.Container size="sm">
              <Modal.Dialog>
                <Modal.Header>
                  <Modal.Heading>Confirm Delete</Modal.Heading>
                  <Modal.CloseTrigger />
                </Modal.Header>
                <Modal.Body>
                  <p className="text-gray-600 dark:text-gray-300">
                    Are you sure you want to delete this tutor? This action
                    cannot be undone.
                  </p>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="ghost" onPress={delModal.close}>
                    Cancel
                  </Button>
                  <Button variant="danger" onPress={handleDelete}>
                    Delete
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
