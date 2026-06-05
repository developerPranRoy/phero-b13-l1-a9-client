"use client";
import { ReactNode } from "react";
// HeroUI v3 doesn't require a Provider wrapper
export default function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
