"use client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/use-user";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles: ("CUSTOMER" | "VENDOR" | "ADMIN")[];
};

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      return;
    }
    if (!allowedRoles.includes(user.role)) {
      router.push("/login"); // not allowed
    }
  }, [user]);

  if (!user || !allowedRoles.includes(user.role)) return null; // or loader

  return <>{children}</>;
};
