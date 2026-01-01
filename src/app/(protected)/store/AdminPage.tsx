"use client";
import { exitStore, fetchStore } from "@/actions/storeAction";
import { StoreDoc } from "@/models/Store";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserDoc } from "@/models/User";
import { Button } from "@/components/ui/button";
import { ResponseMessage } from "@/types/auth";

export default function AdminPage() {
  const [store, setStore] = useState<StoreDoc[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const getStore = async () => {
    setLoading(true);
    try {
      const s = await fetchStore();

      setStore(s as StoreDoc[]);
    } catch (err) {
      console.error(err);
      setStore([]);
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

      setStore((prev) => prev?.filter((s) => s._id.toString() !== id) ?? null);
      alert("Store deleted successfully!");
    } catch (err) {
      alert((err as ResponseMessage)?.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getStore();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading stores...</p>;
  if (!store?.length)
    return <p className="text-center mt-4">No stores found.</p>;

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4">Stores</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Vendor ID</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {store.map((s) => (
            <TableRow key={s._id?.toString()}>
              <TableCell>{s._id?.toString()}</TableCell>
              <TableCell>{s.name}</TableCell>
              <TableCell>{(s.venderId as UserDoc)?.name}</TableCell>
              <TableCell>{s.products?.length || 0}</TableCell>
              <TableCell>{s.orders?.length || 0}</TableCell>
              <TableCell>{new Date(s.createdAt).toLocaleString()}</TableCell>
              <TableCell>{new Date(s.updatedAt).toLocaleString()}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete({ id: s._id.toString() })}
                  disabled={deleting === s._id.toString()}
                >
                  {deleting === s._id.toString() ? "Deleting..." : "Delete"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
