import type { Metadata } from "next";
export const metadata: Metadata = { title: "My Booked Sessions" };
export default function MyBookingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
