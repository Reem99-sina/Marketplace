// src/app/(store)/store/layout.tsx
"use client";

import { useUser } from "@/contexts/use-user";
import { Role } from "@/models/Role";
import AdminPage from "./AdminPage";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();

  const role = user?.role;

  return <>{role === Role.ADMIN ? <AdminPage /> : children}</>;
}
