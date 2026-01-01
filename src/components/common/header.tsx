"use client";

import { useUser } from "@/contexts/use-user";
import { useCart } from "@/contexts/useCart";
import { Role } from "@/models/Role";
import { LogOut, Package, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

export function Header() {
  const { user, refetchUser } = useUser();
  const { cartCount } = useCart();

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    if (!confirm("Are you sure you want to logout?")) return;
    try {
      setLoading(true);

      // استدعاء API logout أو مسح الـ token
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      refetchUser();
      router.replace("/login");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 justify-between px-5">
      {user?.role == Role.CUSTOMER && (
        <div className="flex items-center gap-3">
          <Button
            onClick={handleLogout}
            variant="destructive"
            disabled={loading}
          >
            <LogOut className="w-4 h-4" />
          </Button>
          <Link href="/cart" className="relative">
            <ShoppingCart />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <Link href="/product" className="flex items-center gap-1">
            <Package className="w-5 h-5" />
            <span className="text-sm">Products</span>
          </Link>
        </div>
      )}
      <div className="flex items-center gap-3 py-5">
        <div className="flex flex-col text-sm text-right">
          <span className="font-semibold text-gray-800">{user?.name}</span>
          <span className="text-gray-500">{user?.email}</span>
          <span className="text-xs text-blue-600">{user?.role}</span>
        </div>
        <div>
          <User />
        </div>
      </div>
    </div>
  );
}
