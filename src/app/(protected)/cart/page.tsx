"use client";

import { useEffect, useState } from "react";
import { fetchCart, removeFromCart, clearCart } from "@/actions/cartAction";
import {  CartPopulated } from "@/models/Cart";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useCart } from "@/contexts/useCart";
import { ProductDoc } from "@/models/Product";
import Link from "next/link";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { Role } from "@/models/Role";
import { ResponseMessage } from "@/types/auth";

export default function Cart() {
  const [cart, setCart] = useState<CartPopulated | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { refreshCart } = useCart();

  // Fetch cart on mount
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        const data = await fetchCart();
        setCart(data);
      } catch (err) {
        setError((err as ResponseMessage)?.message || "Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  // Handle remove product
  const handleRemove = async (productId: string) => {
    setLoading(true);
    try {
      const updatedCart = await removeFromCart(productId);
      setCart(updatedCart);
      await refreshCart();
    } catch (err) {
      setError((err as ResponseMessage)?.message || "Failed to remove product");
    } finally {
      setLoading(false);
    }
  };

  // Handle clear cart
  const handleClear = async () => {
    setLoading(true);
    try {
      const updatedCart = await clearCart();
      setCart(updatedCart);
      await refreshCart();
    } catch (err) {
      setError((err as ResponseMessage)?.message || "Failed to clear cart");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !cart) return <p>Loading cart...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!cart || cart.items.length === 0)
    return (
      <div className="space-y-4 px-5 w-full">
        <p>Your cart is empty.</p>
      </div>
    );

  return (
    <ProtectedRoute allowedRoles={[Role.CUSTOMER]}>
      <div className="space-y-4 px-5 w-full flex flex-col">
        <div className="flex items-center justify-between py-5">
          <h1 className="text-2xl font-bold">Your Cart</h1>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClear}>
              Clear Cart
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cart.items.map((item) => (
            <div
              key={item?.product?._id?.toString()}
              className="flex justify-between items-center border px-3 gap-3   rounded"
            >
              <Image
                src={"/defualtProduct.jpg"} // صورة افتراضية
                alt={item.product.name}
                className="w-full h-40 object-cover rounded-t-md"
                height={40}
                width={50}
              />
              <div className="flex flex-col gap-4 py-4">
                <div>
                  <p className="font-semibold">
                    {(item.product as ProductDoc).name}
                  </p>
                  <p>Price: ${(item.product as ProductDoc).price}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => handleRemove(item.product._id?.toString())}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div>
          <Link
            className={`bg-black text-white py-2 px-4 rounded-lg font-bold ${
              cart.items.length === 0 ? "opacity-50 pointer-events-none" : ""
            }`}
            href="/checkout"
            // onClick={() => handleRemove(item.product._id as ObjectId)}
          >
            CheckOut
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  );
}
