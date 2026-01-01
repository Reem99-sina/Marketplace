"use client";

import { useEffect, useState } from "react";
import {
  fetchStore,
  createStore as createStoreApi,
  exitStore as exitStoreApi,
} from "@/actions/storeAction";
import { StoreDoc } from "@/models/Store";
import { StoreInfo } from "@/components/store/StoreInfo";
import { CreateStoreForm } from "@/components/store/CreateStoreForm";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { Role } from "@/models/Role";
import { useUser } from "@/contexts/use-user";
import { ResponseMessage } from "@/types/auth";

export default function VendorStorePage() {
  const [store, setStore] = useState<StoreDoc | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const getStore = async () => {
    setLoading(true);
    try {
      const s = await fetchStore();
      setStore(s as StoreDoc);
    } catch (err) {
      console.log(err);
      setStore(null);
    } finally {
      setLoading(false);
    }
  };

  const createStore = async () => {
    if (!name) return alert("Store name is required");
    setLoading(true);
    try {
      const newStore = await createStoreApi({ name, description });
      setStore(newStore);
      setName("");
      setDescription("");
      alert("Store created successfully!");
    } catch (err) {
      alert((err as ResponseMessage)?.message);
    } finally {
      setLoading(false);
    }
  };

  const exitStore = async () => {
    if (!confirm("Are you sure you want to exit/delete this store?")) return;
    setLoading(true);
    try {
      if (user?.store) {
        await exitStoreApi({ storedId: user?.store });
        setStore(null);
        alert("Store deleted successfully!");
      }
    } catch (err) {
      alert((err as ResponseMessage)?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStore();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <ProtectedRoute allowedRoles={[Role.ADMIN, Role.VENDOR]}>
      <div className="p-6 mx-5 bg-white rounded-lg shadow space-y-6 w-full">
        {store ? (
          <StoreInfo store={store} refresh={getStore} exit={exitStore} />
        ) : (
          <CreateStoreForm
            createStore={createStore}
            name={name}
            description={description}
            setDescription={setDescription}
            setName={setName}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
