import { StoreDoc } from "@/models/Store";

export const fetchStore = async (): Promise<StoreDoc | null | StoreDoc[]> => {
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

// Create store
export const createStore = async (payload: {
  name: string;
  description?: string;
}): Promise<StoreDoc> => {
  const res = await fetch("/api/store", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create store");
  return data.store;
};

// Delete / Exit store
export const exitStore = async ({
  storedId,
}: {
  storedId: string;
}): Promise<void> => {
  const res = await fetch(`/api/store/${storedId}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete store");
};
