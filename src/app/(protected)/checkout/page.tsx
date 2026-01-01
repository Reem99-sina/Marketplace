"use client";

import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { Role } from "@/models/Role";
import { useEffect, useState } from "react";
import { fetchCart } from "@/actions/cartAction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // ShadCN Input
import { useRouter } from "next/navigation";
import { CartItemPopulated, CartPopulated } from "@/models/Cart";
import { createOrder, createPayment } from "@/actions/orderActions";
import { AxiosError } from "axios";
import { useCart } from "@/contexts/useCart";
import { checkoutSchema } from "@/lib/validation/order";
import { OrderDoc } from "@/models/Order";

// 1️⃣ Zod schema for validation

export const COMMISSION_RATE = 0.05;
export default function Checkout() {
  const [cart, setCart] = useState<CartPopulated | null>(null);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const { refreshCart } = useCart();
  const [errors, setErrors] = useState<{
    phone?: string | string[];
    address?: string | string[];
    message?: string | string[];
  }>({});
  const router = useRouter();

  useEffect(() => {
    fetchCart().then(setCart);
  }, []);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-6 w-full">
        <p className="text-gray-500 text-lg">Your cart is empty.</p>
      </div>
    );
  }

  const subtotal = cart.items.reduce(
    (acc: number, item: CartItemPopulated) =>
      acc + Number(item.product.price) * item.quantity,
    0
  );

  const commission = subtotal * COMMISSION_RATE;
  const total = subtotal + commission;

  const handleCheckout = async () => {
    const parsed = checkoutSchema.safeParse({
      phone,
      address,
      commission: COMMISSION_RATE,
    });
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    try {
      setLoading(true);
      const order = await createOrder({
        phone,
        address,
      });
      // router.push("/success"); // redirect to success page
      await refreshCart();
      setCart(null);
      order?.map(
        async (ele: OrderDoc) =>
          await createPayment({ orderId: ele._id?.toString() }).then(
            async (res) => {
              const clientSecret = res.clientSecret;

              // 3️⃣ Redirect to payment page
              router.push(
                `/payment/${order[0]._id}?clientSecret=${clientSecret}`
              );
            }
          )
      );
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
    <ProtectedRoute allowedRoles={[Role.CUSTOMER]}>
      <div className="w-full mx-auto p-6 flex flex-col lg:flex-row gap-8 min-h-[80vh] ">
        {/* Form Section */}
        <div className="lg:w-1/2 bg-white p-6 rounded-xl shadow-lg flex flex-col gap-4">
          <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>

          <div className="flex flex-col gap-2">
            <h2>Phone</h2>
            <Input
              id="phone"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <h2>Address</h2>
            <Input
              id="address"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}
          </div>
          {errors.message && (
            <p className="text-red-500 text-sm">{errors.message}</p>
          )}
          <Button
            onClick={handleCheckout}
            disabled={loading || cart.items.length === 0}
            className="w-full mt-4 py-3 text-lg font-semibold"
          >
            {loading ? "Processing..." : "Confirm Order"}
          </Button>
        </div>

        {/* Order Summary Section */}
        <div className="lg:w-1/2 bg-gray-50 p-6 rounded-xl shadow-lg flex flex-col gap-4">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

          <div className="flex flex-col gap-3">
            {cart.items.map((item: CartItemPopulated) => (
              <div
                key={item.product._id?.toString()}
                className="flex justify-between items-center border-b py-3"
              >
                <span className="font-medium">{item.product.name}</span>
                <span className="text-gray-700">
                  {item.quantity} × ${item.product.price}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Commission (5%):</span>
              <span>${commission.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-xl font-semibold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
