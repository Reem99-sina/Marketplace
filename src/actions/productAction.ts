import { ProductDoc } from "@/models/Product";


export type NewProductInput = {
  name: string;
  price: string;
};

// جلب كل المنتجات للـ vendor
export const fetchProducts = async ({
  storeId,
}: {
  storeId?: string;
}): Promise<ProductDoc[]> => {
  const res = await fetch(`/api/store/${storeId}/products`, {
    credentials: "include",
  });
  const data = await res.json();
  return data.products || [];
};
export const fetchProductsAdmin = async (): Promise<
  ProductDoc | null | ProductDoc[]
> => {
  const res = await fetch("/api/store", { cache: "no-store" });

  if (!res.ok) {
 
    return null;
  }

  try {
    const data = await res.json();
    return data.store ?? null;
  } catch {
    return null;
  }
};
// إضافة منتج جديد
export const addProduct = async (
  product: NewProductInput
): Promise<ProductDoc> => {
  const res = await fetch("/api/product", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(product),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to add product");
  return data.product;
};

export const deleteProduct = async (productId: string): Promise<void> => {
  const res = await fetch(`/api/product/${productId}`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete product");
};

export const fetchAllProducts = async (): Promise<ProductDoc[]> => {
  const res = await fetch(`/api/product`, {
    credentials: "include",
  });
  const data = await res.json();
  return data.products || [];
};
