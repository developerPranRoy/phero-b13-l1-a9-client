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

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  photoURL: z.string().url("Must be a valid URL"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register: registerUser, setUser, setToken } = useAuth();
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser(data.name, data.email, data.photoURL, data.password);
      toast.success("Account created! Please log in.");
      router.push("/login");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || "Registration failed";
      toast.error(msg);
    }
  };

  const handleGoogle = async () => {
    try {
      const { data } = await api.post("/api/auth/google-mock");
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("mq_user", JSON.stringify(data.user));
      toast.success("Signed up with Google!");
      router.push("/");
    } catch {
      toast.error("Google signup failed");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <Card.Header>
          <Card.Title>Create Account</Card.Title>
          <Card.Description>Join MediQueue and start learning today</Card.Description>
        </Card.Header>
        <Card.Content className="flex flex-col gap-4">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <FormField label="Full Name" placeholder="John Doe" error={errors.name?.message} {...register("name")} />
            <FormField label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
            <FormField label="Photo URL" placeholder="https://i.ibb.co/..." error={errors.photoURL?.message} {...register("photoURL")} />
            <div className="relative">
              <FormField
                label="Password"
                type={showPass ? "text" : "password"}
                placeholder="Min 6 chars, upper + lowercase"
                error={errors.password?.message}
                {...register("password")}
              />
              <button type="button" onClick={() => setShowPass((p) => !p)} className="absolute right-3 top-8 text-gray-400 text-xs">
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
            <FormField label="Confirm Password" type="password" placeholder="Repeat password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
            <Button type="submit" variant="primary" fullWidth isDisabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Account"}
            </Button>
          </form>

          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-gray-400 text-xs">OR</span>
            <Separator className="flex-1" />
          </div>

          <Button variant="outline" fullWidth onPress={handleGoogle}>
            <svg width="18" height="18" viewBox="0 0 24 24" className="mr-2">
           
            </svg>
            Continue with Google
          </Button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-medium hover:underline">Login</Link>
          </p>
        </Card.Content>
      </Card>
    </div>
  );
}
