"use client";

import { useUser } from "@/contexts/use-user";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Role } from "@/models/Role";

export default function Home() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // ⛔ لسه بيجيب البيانات

    // مش مسجل دخول
    if (!user) return;

    // ✅ Vendor logic
    if (user.role === Role.VENDOR||user.role === Role.ADMIN) {
      router.replace(`/store`);
    } else if (user.role === Role.CUSTOMER) {
      router.replace(`/product`);
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      {isLoading ? "Loading..." : "Welcome"}
    </div>
  );
}
