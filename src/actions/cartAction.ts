import { CartDoc, CartPopulated } from "@/models/Cart";


export type AddToCartInput = {
  productId: string;
  quantity?: number;
};

// ------------------------
// Fetch user cart
// ------------------------
export const fetchCart = async (): Promise<CartPopulated | null> => {
  const res = await fetch("/api/cart", {
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch cart");

  return data.cart;
};

// ------------------------
// Add product to cart
// ------------------------
export const addToCart = async ({
  productId,
  quantity = 1,
}: AddToCartInput): Promise<CartDoc> => {
  const res = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ productId, quantity }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to add to cart");

  return data.cart;
};

// ------------------------
// Remove product from cart
// ------------------------
export const removeFromCart = async (productId: string): Promise<CartPopulated> => {
  const res = await fetch(`/api/cart?productId=${productId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to remove from cart");

  return data.cart;
};

// ------------------------
// Clear entire cart
// ------------------------
export const clearCart = async (): Promise<CartPopulated> => {
  const res = await fetch("/api/cart", {
    method: "PATCH",
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to clear cart");

  return data.cart;
};
