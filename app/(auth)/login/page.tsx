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
  const [googleLoading, setGoogleLoading] = useState(false);

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
    setGoogleLoading(true);
    try {
      const { data } = await api.post("/api/auth/google-mock");
      setToken(data.token);
      const userData = data.user;
      setUser(userData);
      localStorage.setItem("mq_user", JSON.stringify(userData));
      toast.success("Logged in with Google!");
      router.push(redirect);
    } catch {
      toast.error("Google login failed. Please use email/password.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <Card.Header>
          <Card.Title className="text-2xl font-bold">Login</Card.Title>
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

          <Button variant="outline" fullWidth onPress={handleGoogle} isDisabled={googleLoading}>
            <svg width="18" height="18" viewBox="0 0 24 24" className="mr-2" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {googleLoading ? "Signing in..." : "Continue with Google"}
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
