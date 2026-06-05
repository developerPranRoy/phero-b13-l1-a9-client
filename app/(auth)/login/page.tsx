"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Card, Separator } from "@heroui/react";
import FormField from "@/components/ui/FormField";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import api from "@/lib/axios";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login, setUser, setToken } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!");
      router.push(redirect);
    } catch {
      toast.error("Invalid email or password");
    }
  };

  const handleGoogle = async () => {
    try {
      const { data } = await api.post("/api/auth/google-mock");
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("mq_user", JSON.stringify(data.user));
      toast.success("Logged in with Google!");
      router.push(redirect);
    } catch {
      toast.error("Google login failed");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <Card.Header>
          <Card.Title>Welcome Back</Card.Title>
          <Card.Description>Sign in to your MediQueue account</Card.Description>
        </Card.Header>
        <Card.Content className="flex flex-col gap-4">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <div className="relative">
              <FormField
                label="Password"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
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
            <Link href="#" className="text-blue-600 text-sm self-end hover:underline">
              Forgot password?
            </Link>
            <Button type="submit" variant="primary" fullWidth isDisabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Login"}
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
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-600 font-medium hover:underline">Register</Link>
          </p>
        </Card.Content>
      </Card>
    </div>
  );
}
