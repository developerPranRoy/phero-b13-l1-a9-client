export interface Tutor {
  _id: string;
  name: string;
  photo: string;
  subject: string;
  availableDays: string;
  availableTime: string;
  hourlyFee: number;
  totalSlot: number;
  sessionStartDate: string;
  institution: string;
  experience: string;
  location: string;
  teachingMode: "Online" | "Offline" | "Both";
  createdBy: string;
  createdAt: string;
}

export interface Booking {
  _id: string;
  tutorId: string;
  tutorName: string;
  studentName: string;
  studentEmail: string;
  phone: string;
  status: "pending" | "cancelled";
  sessionToken: string;
  bookedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}
