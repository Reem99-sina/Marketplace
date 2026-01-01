import { getUsers } from "@/actions/getUser";
import connect from "@/lib/connect";
import { Order, OrderItemPopulated } from "@/models/Order";
import { OrderItemDoc } from "@/models/OrderItem";
import { Role } from "@/models/Role";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }>  }
) {
  await connect();
  const { orderId } = await params;
  // Check for token
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!token)
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  try {
    const user = await getUsers({ token });
    if (!user || user.user.role !== Role.CUSTOMER)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const order = await Order.findById(orderId).populate({
      path: "orderItems",
      populate: { path: "productId" }, // populate product inside orderItems
    });
    if (!order)
      return NextResponse.json({ message: "Order not found" }, { status: 404 });

    // Calculate total amount including commission

    const orderTotal =
      order.orderItems.reduce(
        (sum: number, item: OrderItemPopulated) =>
          sum + (Number(item.productId?.price) || 0) * item.quantity,
        0
      ) + (order.commission || 0);

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(orderTotal * 100), // convert to cents
      currency: "usd",
      metadata: {
        userId: user.user._id.toString(),
        orderId: order._id.toString(),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      order,
    });
  } catch (error) {
    console.error("GET orders error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
