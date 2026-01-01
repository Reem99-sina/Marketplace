"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ResponseMessage } from "@/types/auth";
import axios, { AxiosError } from "axios";
import { useUser } from "@/contexts/use-user";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ResponseMessage>(null);
  const [success, setSuccess] = useState<ResponseMessage>(null);
  const { refetchUser } = useUser();
  const router = useRouter();

  const submit = async () => {
    setLoading(true);
    setErrors(null);
    setSuccess(null);

    try {
      const res = await axios.post("/api/auth/login", {
        redirect: false,
        email,
        password,
      });

      if (!res) throw new Error("No response from server");

      setSuccess({ message: "Login successful!" });

      // Optional: you can fetch the token if you want
      // const token = await fetch("/api/auth/token").then(r => r.json());
      await refetchUser();
      router.push("/Home");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setErrors({
        message:
          error?.response?.data.message || error?.message || "error network",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500">
          Login to your account to continue
        </p>

        <div className="space-y-4">
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-100"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-100"
          />
        </div>

        {errors?.message && (
          <p className="text-red-500 text-center">{errors.message}</p>
        )}

        {success?.message && (
          <p className="text-green-500 text-center">{success.message}</p>
        )}

        <Button
          onClick={submit}
          className="w-full"
          disabled={loading || !email || !password}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        <p className="text-center text-gray-500">
          Don’t have an account?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
