export interface Tutor {
  id: string;
  name: string;
  photo: string;
  subject: string;
  available_days: string;
  available_time: string;
  hourly_fee: string | number;
  total_slot: number;
  session_start_date: string;
  institution: string;
  experience: string;
  location: string;
  teaching_mode: "Online" | "Offline" | "Both";
  created_by: string;
  created_at: string;
}

export interface Booking {
  id: string;
  tutor_id: string;
  tutor_name: string;
  student_name: string;
  student_email: string;
  phone: string;
  status: "pending" | "cancelled";
  session_token: string;
  booked_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}
