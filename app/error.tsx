"use client";
import { Button } from "@heroui/react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-6xl mb-4">⚠️</p>
      <h1 className="text-2xl font-bold mb-2 dark:text-white">
        Something went wrong
      </h1>
      <p className="text-gray-500 mb-6">
        {error.message || "An unexpected error occurred"}
      </p>
      <Button variant="primary" onPress={reset}>
        Try Again
      </Button>
    </div>
  );
}
