"use client";
import { exitStore } from "@/actions/storeAction";
import { StoreDoc } from "@/models/Store";
import { useEffect, useState } from "react";
import { UserDoc } from "@/models/User";
import { ResponseMessage } from "@/types/auth";
import { Column, CustomTable } from "@/components/common/customTable";
import { fetchAllProducts } from "@/actions/productAction";
import { ProductDoc } from "@/models/Product";

export default function AdminPage() {
  const [products, setProducts] = useState<ProductDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const loadUserProducts = async () => {
    setLoading(true);
    try {
      const prods = await fetchAllProducts();
      setProducts(prods);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async ({ id }: { id: string }) => {
    if (!confirm("Are you sure you want to exit/delete this store?")) return;
    setLoading(true);
    setDeleting(id);
    try {
      await exitStore({ storedId: id });
     
      setProducts(
        (prev) => prev?.filter((s) => s._id.toString() !== id) ?? null
      );
      alert("Store deleted successfully!");
    } catch (err) {
      alert((err as ResponseMessage)?.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadUserProducts();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading products...</p>;
  if (!products?.length)
    return <p className="text-center mt-4">No products found.</p>;

  const columns: Column<ProductDoc>[] = [
    { key: "_id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "price", label: "Price" },

    {
      key: "store",
      label: "Store",
      render: (p: ProductDoc) => (p.store as StoreDoc)?.name || "N/A",
    },
    {
      key: "storeId",
      label: "Vendor",
      render: (p: ProductDoc) =>
        ((p.store as StoreDoc)?.venderId as UserDoc)?.name || "N/A",
    },

    {
      key: "createdAt",
      label: "Created At",
      render: (p: ProductDoc) => new Date(p.createdAt).toLocaleString(),
    },
  ];

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <CustomTable
        columns={columns}
        data={products}
        onDelete={(item) => handleDelete({ id: item?._id?.toString() })}
        deletingId={deleting}
      />
    </div>
  );
}
