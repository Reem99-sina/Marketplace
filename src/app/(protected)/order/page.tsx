"use client";

import { useEffect, useState } from "react";

import {
  fetchOrdersByStore,
  updateOrder,
  deleteByIdOrder,
} from "@/actions/orderActions"; // فرضًا عندك deleteOrder
import { OrderItemPopulated, OrderPopulated } from "@/models/Order";
import { Badge } from "@/components/ui/badge";
import { ResponseMessage } from "@/types/auth";
import { StoreDoc } from "@/models/Store";

import { Column, CustomTable } from "@/components/common/customTable";

export default function Orders() {
  const [orders, setOrders] = useState<OrderPopulated[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleTogglePaid = async ({ order }: { order: OrderPopulated }) => {
    try {
      setLoading(true);
      const updated = await updateOrder({
        orderId: order?._id?.toString(),
        isPaid: !order.isPaid,
      });
      setOrders((props) =>
        props.map((ele) =>
          ele?._id === order?._id ? { ...ele, isPaid: updated.isPaid } : ele
        )
      );
    } catch (err) {
      alert((err as ResponseMessage)?.message || "Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    setDeletingId(orderId);
    try {
      await deleteByIdOrder({ orderId }); // استدعي API DELETE
      setOrders((prev) => prev.filter((o) => o._id?.toString() !== orderId));
      alert("Order deleted successfully!");
    } catch (err) {
      alert((err as ResponseMessage)?.message || "Failed to delete order");
    } finally {
      setDeletingId(null);
    }
  };

  const getOrders = async () => {
    try {
      const data = await fetchOrdersByStore();
      setOrders(data);
    } catch (err) {
      setError((err as ResponseMessage)?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  if (loading) return <p className="p-6 text-center">Loading orders...</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;
  if (orders.length === 0)
    return <p className="p-6 text-center">No orders found.</p>;

  const columns: Column<OrderPopulated>[] = [
    { key: "_id", label: "Order ID" },
    {
      key: "storeId",
      label: "Store",
      render: (o) => (o.storeId as StoreDoc)?.name || "-",
    },
    {
      key: "userId",
      label: "Customer",
      render: (o) => o.userId?.name || "-",
    },
    {
      key: "phone",
      label: "Customer",
      render: (o) => o.phone || "-",
    },
    {
      key: "address",
      label: "Customer",
      render: (o) => o.address || "-",
    },
    {
      key: "commission",
      label: "Products",
      render: (o) =>
        o.orderItems
          ?.map((i: OrderItemPopulated) => i.productId?.name)
          .join(", ") || "-",
    },
    {
      key: "orderItems",
      label: "Total ($)",
      render: (o) =>
        o.orderItems
          ?.reduce(
            (acc, i) => acc + i.price * i.quantity + (o.commission || 0),
            0
          )
          .toFixed(2),
    },
    {
      key: "isPaid",
      label: "Status",
      render: (o) => (
        <Badge
          variant={o.isPaid ? "default" : "secondary"}
          className="cursor-pointer"
          onClick={() => handleTogglePaid({ order: o })}
        >
          {o.isPaid ? "Paid" : "Pending"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (o) => new Date(o.createdAt).toLocaleString(),
    },
  ];

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <CustomTable
        columns={columns}
        data={orders}
        onDelete={(item) => handleDelete(item?._id?.toString())}
        deletingId={deletingId}
      />
    </div>
  );
}
