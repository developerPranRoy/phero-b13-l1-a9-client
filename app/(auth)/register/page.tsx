"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Card, Separator } from "@heroui/react";
import FormField from "@/components/ui/FormField";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import api from "@/lib/axios";

const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    photoURL: z.string().url("Must be a valid URL"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register: registerUser, setUser, setToken } = useAuth();
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser(data.name, data.email, data.photoURL, data.password);
      toast.success("Account created! Please log in.");
      router.push("/login");
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      const serverMsg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      if (status === 409) {
        toast.error("This email is already registered. Please log in instead.");
      } else {
        toast.error(serverMsg || "Registration failed. Please try again.");
      }
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const { data } = await api.post("/api/auth/google-mock");
      setToken(data.token);
      const userData = data.user;
      setUser(userData);
      localStorage.setItem("mq_user", JSON.stringify(userData));
      toast.success("Signed up with Google!");
      router.push("/");
    } catch {
      toast.error("Google signup failed. Please use email/password.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <Card.Header>
          <Card.Title>Create Account</Card.Title>
          <Card.Description>
            Join MediQueue and start learning today
          </Card.Description>
        </Card.Header>
        <Card.Content className="flex flex-col gap-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <FormField
              label="Full Name"
              placeholder="John Doe"
              error={errors.name?.message}
              {...register("name")}
            />
            <FormField
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <FormField
              label="Photo URL"
              placeholder="https://i.ibb.co/..."
              error={errors.photoURL?.message}
              {...register("photoURL")}
            />
            <div className="relative">
              <FormField
                label="Password"
                type={showPass ? "text" : "password"}
                placeholder="Min 6 chars, upper + lowercase"
                error={errors.password?.message}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                className="absolute right-3 top-8 text-gray-400 text-xs"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
            <FormField
              label="Confirm Password"
              type="password"
              placeholder="Repeat password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isDisabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Account"}
            </Button>
          </form>

          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-gray-400 text-xs">OR</span>
            <Separator className="flex-1" />
          </div>

          <Button
            variant="outline"
            fullWidth
            onPress={handleGoogle}
            isDisabled={googleLoading}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              className="mr-2"
              aria-hidden="true"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {googleLoading ? "Signing up..." : "Continue with Google"}
          </Button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </Card.Content>
      </Card>
    </div>
  );
}
