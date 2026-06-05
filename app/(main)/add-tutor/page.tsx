"use client";
import PrivateRoute from "@/components/ui/PrivateRoute";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Card, Select, ListBox, ListBoxItem } from "@heroui/react";
import FormField from "@/components/ui/FormField";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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

const schema = z.object({
  name: z.string().min(2, "Name required"),
  photo: z.string().url("Must be a valid image URL"),
  subject: z.string().min(1, "Subject required"),
  availableDays: z.string().min(1, "Available days required"),
  availableTime: z.string().min(1, "Available time required"),
  hourlyFee: z.string().min(1, "Fee required"),
  totalSlot: z.string().min(1, "Slots required"),
  sessionStartDate: z.string().min(1, "Date required"),
  institution: z.string().min(2, "Institution required"),
  experience: z.string().min(1, "Experience required"),
  location: z.string().min(2, "Location required"),
  teachingMode: z.string().min(1, "Mode required"),
});

type FormData = z.infer<typeof schema>;

export default function AddTutorPage() {
  const { user } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/api/tutors", {
        ...data,
        hourlyFee: Number(data.hourlyFee),
        totalSlot: Number(data.totalSlot),
        createdBy: user?.email,
      });
      toast.success("Tutor added successfully!");
      router.push("/my-tutors");
    } catch {
      toast.error("Failed to add tutor. Please try again.");
    }
  };

  return (
    <PrivateRoute>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Card>
          <Card.Header>
            <Card.Title>Add New Tutor</Card.Title>
            <Card.Description>
              Fill in the details to list a new tutor
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <FormField
                label="Tutor Name"
                placeholder="e.g. Dr. Rahim Ahmed"
                error={errors.name?.message}
                {...register("name")}
              />
              <FormField
                label="Photo URL"
                placeholder="https://i.ibb.co/..."
                error={errors.photo?.message}
                {...register("photo")}
              />

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium dark:text-white">
                  Subject / Category
                </label>
                <Controller
                  name="subject"
                  control={control}
                  render={({ field }) => (
                    <Select
                      selectedKey={field.value}
                      onSelectionChange={(k) => field.onChange(k)}
                      placeholder="Select subject"
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
                  )}
                />
                {errors.subject && (
                  <p className="text-red-500 text-xs">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium dark:text-white">
                  Teaching Mode
                </label>
                <Controller
                  name="teachingMode"
                  control={control}
                  render={({ field }) => (
                    <Select
                      selectedKey={field.value}
                      onSelectionChange={(k) => field.onChange(k)}
                      placeholder="Select mode"
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
                  )}
                />
                {errors.teachingMode && (
                  <p className="text-red-500 text-xs">
                    {errors.teachingMode.message}
                  </p>
                )}
              </div>

              <FormField
                label="Available Days"
                placeholder="e.g. Sun - Thu"
                error={errors.availableDays?.message}
                {...register("availableDays")}
              />
              <FormField
                label="Available Time"
                placeholder="e.g. 5:00 PM - 8:00 PM"
                error={errors.availableTime?.message}
                {...register("availableTime")}
              />
              <FormField
                label="Hourly Fee (৳)"
                type="number"
                placeholder="e.g. 500"
                error={errors.hourlyFee?.message}
                {...register("hourlyFee")}
              />
              <FormField
                label="Total Slots"
                type="number"
                placeholder="e.g. 10"
                error={errors.totalSlot?.message}
                {...register("totalSlot")}
              />
              <FormField
                label="Session Start Date"
                type="date"
                error={errors.sessionStartDate?.message}
                {...register("sessionStartDate")}
              />
              <FormField
                label="Institution"
                placeholder="e.g. Dhaka University"
                error={errors.institution?.message}
                {...register("institution")}
              />
              <FormField
                label="Experience"
                placeholder="e.g. 3 years"
                error={errors.experience?.message}
                {...register("experience")}
              />
              <FormField
                label="Location (Area/City)"
                placeholder="e.g. Dhanmondi, Dhaka"
                error={errors.location?.message}
                {...register("location")}
              />

              <div className="sm:col-span-2 flex justify-end gap-3 mt-2">
                <Button variant="ghost" onPress={() => router.back()}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  isDisabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Tutor"}
                </Button>
              </div>
            </form>
          </Card.Content>
        </Card>
      </div>
    </PrivateRoute>
  );
}
