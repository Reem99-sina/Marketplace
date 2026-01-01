"use client";

import { useSearchParams, useParams } from "next/navigation";
import StripeProvider from "@/contexts/StripeProvider";
import PaymentForm from "@/components/common/Payment";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { Role } from "@/models/Role";

export default function PayPage() {
  const searchParams = useSearchParams();
  const { orderId } = useParams();

  const clientSecret = searchParams.get("clientSecret");

  if (!clientSecret || !orderId) {
    return <p className="text-center mt-10">Invalid payment session</p>;
  }

  return (
    <ProtectedRoute allowedRoles={[Role.CUSTOMER]}>
      <StripeProvider clientSecret={clientSecret}>
        <PaymentForm orderId={orderId as string} />
      </StripeProvider>
    </ProtectedRoute>
  );
}
