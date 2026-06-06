import type { Metadata } from "next";
export const metadata: Metadata = { title: "My Tutors" };
export default function MyTutorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
