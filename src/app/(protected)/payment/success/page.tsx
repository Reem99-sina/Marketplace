"use client";

import { updateOrder } from "@/actions/orderActions";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { Role } from "@/models/Role";

export default function Success() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    if (!orderId) {
    //    setStatus("error");
      return;
    }

    const updatePaidOrder = async () => {
      try {
        await updateOrder({ orderId, isPaid: true });
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };

    updatePaidOrder();
  }, [orderId]);

  return (
    <ProtectedRoute allowedRoles={[Role.CUSTOMER]}>
      <div className="min-h-[80vh] flex items-center justify-center px-4 w-full">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center mx-auto">
          {status === "loading" && (
            <>
              <Loader2 className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
              <h2 className="mt-4 text-xl font-semibold">
                Processing your payment
              </h2>
              <p className="text-gray-500 mt-2">
                Please wait while we confirm your order.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle2 className="mx-auto h-14 w-14 text-green-500" />
              <h2 className="mt-4 text-2xl font-bold text-gray-900">
                Payment Successful 🎉
              </h2>
              <p className="text-gray-600 mt-2">
                Your order has been paid successfully.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push("/product")}
                >
                  Continue Shopping
                </Button>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <h2 className="text-xl font-semibold text-red-600">
                Something went wrong
              </h2>
              <p className="text-gray-500 mt-2">
                We couldn’t confirm your payment.
              </p>
              <Button className="mt-6" onClick={() => router.push("/")}>
                Go Home
              </Button>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
