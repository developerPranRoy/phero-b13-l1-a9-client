import { Spinner as HeroSpinner } from "@heroui/react";

export default function Spinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-3">
      <HeroSpinner size="lg" />
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
