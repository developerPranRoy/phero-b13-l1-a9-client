"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Switch } from "@heroui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";

export default function AppNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMenuOpen(false);
    toast.success("Logged out successfully");
    router.push("/");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/tutors", label: "Tutors" },
    ...(user
      ? [
          { href: "/add-tutor", label: "Add Tutor" },
          { href: "/my-tutors", label: "My Tutors" },
          { href: "/my-bookings", label: "My Booked Sessions" },
        ]
      : []),
  ];

  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        <Link
          href="/"
          className="font-bold text-xl text-blue-600 dark:text-blue-400 shrink-0"
        >
          🎓 MediQueue
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden sm:flex items-center gap-1 flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">

          {/* Dark mode toggle */}
          <Switch
            isSelected={theme === "dark"}
            onChange={toggleTheme}
            size="sm"
            aria-label="Toggle dark mode"
          >
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </Switch>

          {/* Auth section — only render after hydration */}
          {!loading && (
            <>
              {user ? (
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setDropdownOpen((p) => !p)}
                    className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                        {user.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </button>

                  {dropdownOpen && (
                    <>
                      {/* Backdrop to close on outside click */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 py-1">
                        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-sm font-medium dark:text-white truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => router.push("/login")}
                    className="px-4 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => router.push("/register")}
                    className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Register
                  </button>
                </div>
              )}
            </>
          )}

          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-2 rounded-md text-gray-600 dark:text-gray-300"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {!loading && (
            user ? (
              <>
                <div className="py-2 border-t border-gray-100 dark:border-gray-700 mt-2">
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-sm text-red-500 hover:text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block py-2 text-sm text-blue-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block py-2 text-sm text-blue-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )
          )}
        </div>
      )}
    </header>
  );
}
