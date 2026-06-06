import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-8xl font-bold text-blue-200 dark:text-blue-900 mb-2">
        404
      </p>
      <h1 className="text-3xl font-bold mb-3 dark:text-white">
        Page Not Found
      </h1>
      <p className="text-gray-500 mb-6 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
      >
        Go to Homepage
      </Link>
    </div>
  );
}
