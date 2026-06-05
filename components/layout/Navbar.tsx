"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Button, Dropdown, Avatar, Switch } from "@heroui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AppNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const handleLogout = () => {
    logout();
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
          className="font-bold text-xl text-blue-600 dark:text-blue-400 flex-shrink-0"
        >
          🎓 MediQueue
        </Link>

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

      
        <div className="flex items-center gap-2">
         
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

          {user ? (
            <Dropdown>
              <Dropdown.Trigger>
                <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <Avatar size="sm">
                    {user.image ? (
                      <Avatar.Image src={user.image} alt={user.name} />
                    ) : (
                      <Avatar.Fallback>
                        {user.name?.[0]?.toUpperCase()}
                      </Avatar.Fallback>
                    )}
                  </Avatar>
                </button>
              </Dropdown.Trigger>
              <Dropdown.Popover>
                <Dropdown.Menu aria-label="User menu">
                  <Dropdown.Item
                    id="email"
                    className="text-xs text-gray-500 cursor-default"
                  >
                    {user.email}
                  </Dropdown.Item>
                  <Dropdown.Item
                    id="logout"
                    onAction={handleLogout}
                    className="text-red-500"
                  >
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onPress={() => router.push("/login")}
              >
                Login
              </Button>
              <Button
                variant="primary"
                size="sm"
                onPress={() => router.push("/register")}
              >
                Register
              </Button>
            </div>
          )}

          <button
            className="sm:hidden p-2 rounded-md text-gray-600 dark:text-gray-300"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

     
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
          {!user && (
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
          )}
        </div>
      )}
    </header>
  );
}
