import type { Metadata } from "next";
export const metadata: Metadata = { title: "Find a Tutor" };
export default function TutorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
