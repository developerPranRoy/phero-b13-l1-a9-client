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
  "Mathematics", "Physics", "Chemistry", "Biology", "English",
  "Bengali", "History", "Geography", "Computer Science",
  "Economics", "Accounting", "Music", "Art",
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
      .then((r) => {
        const raw = r.data;
        const list: Tutor[] =
          raw?.data?.tutors ?? raw?.tutors ?? (Array.isArray(raw) ? raw : []);
        setTutors(list);
      })
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
      const { data } = await api.put(`/api/tutors/${selected.id}`, form);
      const updated: Tutor = data?.data?.tutor ?? data?.tutor ?? data;
      setTutors((prev) =>
        prev.map((t) => (t.id === selected.id ? updated : t)),
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
      setTutors((prev) => prev.filter((t) => t.id !== delTarget));
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
            <p className="text-xl font-semibold mb-2 dark:text-white">No tutors yet</p>
            <p className="text-gray-500 mb-4">You haven&apos;t added any tutors</p>
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
                  <Table.Row id={t.id}>
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
                        <span className="font-medium dark:text-white">{t.name}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {t.subject}
                      </span>
                    </Table.Cell>
                    <Table.Cell>{t.teaching_mode}</Table.Cell>
                    <Table.Cell>
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        t.total_slot > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}>
                        {t.total_slot}
                      </span>
                    </Table.Cell>
                    <Table.Cell>৳{t.hourly_fee}/hr</Table.Cell>
                    <Table.Cell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onPress={() => openEdit(t)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger-soft"
                          onPress={() => { setDelTarget(t.id); delModal.open(); }}
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
                  <FormField label="Name" value={form.name || ""}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                  <FormField label="Photo URL" value={form.photo || ""}
                    onChange={(e) => setForm((f) => ({ ...f, photo: e.target.value }))} />

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium dark:text-white">Subject</label>
                    <Select selectedKey={form.subject}
                      onSelectionChange={(k) => setForm((f) => ({ ...f, subject: k as string }))}
                      aria-label="Subject">
                      <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
                      <Select.Popover>
                        <ListBox>{SUBJECTS.map((s) => <ListBoxItem key={s} id={s}>{s}</ListBoxItem>)}</ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium dark:text-white">Teaching Mode</label>
                    <Select selectedKey={form.teaching_mode}
                      onSelectionChange={(k) => setForm((f) => ({ ...f, teaching_mode: k as "Online" | "Offline" | "Both" }))}
                      aria-label="Mode">
                      <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
                      <Select.Popover>
                        <ListBox>{MODES.map((m) => <ListBoxItem key={m} id={m}>{m}</ListBoxItem>)}</ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  <FormField label="Available Days" value={form.available_days?.toString().replace(/[{}"]/g, "") || ""}
                    onChange={(e) => setForm((f) => ({ ...f, available_days: e.target.value }))} />
                  <FormField label="Available Time" value={form.available_time || ""}
                    onChange={(e) => setForm((f) => ({ ...f, available_time: e.target.value }))} />
                  <FormField label="Hourly Fee" type="number" value={String(form.hourly_fee || "")}
                    onChange={(e) => setForm((f) => ({ ...f, hourly_fee: e.target.value }))} />
                  <FormField label="Total Slots" type="number" value={String(form.total_slot || "")}
                    onChange={(e) => setForm((f) => ({ ...f, total_slot: Number(e.target.value) }))} />
                  <FormField label="Institution" value={form.institution || ""}
                    onChange={(e) => setForm((f) => ({ ...f, institution: e.target.value }))} />
                  <FormField label="Experience" value={form.experience || ""}
                    onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))} />
                  <FormField label="Location" value={form.location || ""}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="ghost" onPress={editModal.close}>Cancel</Button>
                  <Button variant="primary" onPress={handleUpdate}>Save Changes</Button>
                </Modal.Footer>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>

        {/* Delete Modal */}
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
                    Are you sure you want to delete this tutor? This action cannot be undone.
                  </p>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="ghost" onPress={delModal.close}>Cancel</Button>
                  <Button variant="danger" onPress={handleDelete}>Delete</Button>
                </Modal.Footer>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      </div>
    </PrivateRoute>
  );
}
