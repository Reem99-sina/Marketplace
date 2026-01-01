import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/connect";
import { Order } from "@/models/Order";
import { getUsers } from "@/actions/getUser";
import { Role } from "@/models/Role";
import { OrderItem } from "@/models/OrderItem";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  await connect();
  const { orderId } = await params;
  const body = await req.json();
  const { isPaid } = body;
  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const user = await getUsers({ token });
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const order = await Order.findById(orderId);
  if (!order)
    return NextResponse.json({ message: "Order not found" }, { status: 404 });

  // فقط الادمن أو صاحب الطلب
  if (
    user.user.role !== Role.ADMIN &&
    order.userId?.toString() !== user.user._id.toString()
  ) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  order.isPaid = isPaid;
  await order.save();

  return NextResponse.json({ order });
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  await connect();
  const orderId = await context.params;

  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const user = await getUsers({ token });
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const order = await Order.findById(orderId);
  if (!order)
    return NextResponse.json({ message: "Order not found" }, { status: 404 });

  // فقط الادمن أو صاحب الطلب
  if (
    user.user.role !== Role.ADMIN &&
    order.userId?.toString() !== user.user._id.toString()
  ) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ order });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  await connect();

  const { orderId } = await params;

  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await getUsers({ token });
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }

  // ✅ فقط الأدمن أو صاحب الطلب
  if (
    user.user.role !== Role.ADMIN &&
    order.userId?.toString() !== user.user._id.toString()
  ) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  await OrderItem.deleteMany({ orderId: orderId });
  await Order.findByIdAndDelete(orderId);

  return NextResponse.json(
    { message: "Order deleted successfully" },
    { status: 200 }
  );
}
