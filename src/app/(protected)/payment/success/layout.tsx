"use client";

import { Suspense } from "react";

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<>...</>}>{children}</Suspense>;
}
