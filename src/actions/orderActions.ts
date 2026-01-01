import { OrderDoc } from "@/models/Order";

export const createOrder = async (data: { phone: string; address: string }) => {
  const res = await fetch("/api/order", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone: data?.phone,
      address: data?.address,
      commission: 5,
    }), // example commission
  });

  const json = await res.json();

  if (!res.ok) throw new Error(json.message);
  return json.orders;
};

export const fetchOrders = async (): Promise<OrderDoc[]> => {
  const res = await fetch("/api/order", {
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);

  return data.orders || [];
};

export const updateOrder = async ({
  orderId,
  isPaid,
}: {
  orderId: string;
  isPaid: boolean;
}) => {
  const res = await fetch(`/api/order/${orderId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isPaid }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update order");

  return data.order;
};

export const getByIdOrder = async ({ orderId }: { orderId: string }) => {
  const res = await fetch(`/api/order/${orderId}`);

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update order");

  return data.order;
};


export const createPayment = async (data: { orderId: string }) => {
  const res = await fetch(`/api/order/pay/${data?.orderId}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json;
};

export const fetchOrdersByStore = async () => {
  const res = await fetch(`/api/order`, {
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data.orders;
};

export const deleteByIdOrder = async ({
  orderId,

}: {
  orderId: string;

}) => {
  const res = await fetch(`/api/order/${orderId}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update order");

  return data.order;
};