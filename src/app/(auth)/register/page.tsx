"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { registerSchema } from "@/lib/validation/register"; // adjust path
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { ResponseMessage } from "@/types/auth";
type RegisterErrors = Partial<
  Record<keyof z.infer<typeof registerSchema>, string[]>
> & {
  server?: string;
};
export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [success, setSuccess] = useState<ResponseMessage | null>(null);

  const submit = async () => {
    // Reset errors
    setErrors({});

    // Validate with Zod
    const result = registerSchema.safeParse({ name, email, password, role });

    if (!result.success) {
      // Map Zod errors to state

      const fieldErrors = result.error.flatten().fieldErrors; // هذا يعطي object لكل حقل
      setErrors(fieldErrors as Record<string, string[]>);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/register", {
        name,
        email,
        password,
        role,
      });

      setSuccess(res.data);
      router.push("/login");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setErrors((prev) => ({
        ...prev,
        server:
          error?.response?.data.message || error?.message || "error network",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Create Account
        </h1>
        <p className="text-center text-gray-500">
          Register to start your journey
        </p>

        <div className="space-y-4">
          <Input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-100"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-100"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email[0]}</p>
          )}

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-100"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password[0]}</p>
          )}

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="CUSTOMER">Customer</option>
            <option value="VENDOR">Vendor</option>
            <option value="ADMIN">Admin</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm">{errors.role[0]}</p>
          )}

          {errors.server && (
            <p className="text-red-500 text-center">{errors.server}</p>
          )}
          {success?.message && (
            <p className="text-green-500 text-sm">{success?.message}</p>
          )}
        </div>

        <Button
          onClick={submit}
          className="w-full"
          disabled={loading || !name || !email || !password || !role}
        >
          {loading ? "Registering..." : "Register"}
        </Button>

        <p className="text-center text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
