"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fetchCart } from "@/actions/cartAction";
import { useUser } from "@/contexts/use-user";

type CartContextType = {
  cartCount: number;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType>({
  cartCount: 0,
  refreshCart: async () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const [cartCount, setCartCount] = useState(0);

  const refreshCart = async () => {
    if (!user) return;
    try {
      const cart = await fetchCart();
      const total = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
      setCartCount(total);
    } catch (err) {
      console.error("Failed to refresh cart:", err);
    }
  };

  // Load cart count on mount or user change
  useEffect(() => {
    refreshCart();
  }, [user]);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
