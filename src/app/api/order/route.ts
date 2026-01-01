import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/connect";
import { getUsers } from "@/actions/getUser";
import { Cart, CartItemPopulated } from "@/models/Cart";
import { Order, OrderItemPopulated } from "@/models/Order";
import { OrderItem } from "@/models/OrderItem";
import { Role } from "@/models/Role";
import { checkoutSchema } from "@/lib/validation/order";

export async function POST(req: NextRequest) {
  await connect();

  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const user = await getUsers({ token });
  if (!user || user.user.role !== Role.CUSTOMER)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parseResult = checkoutSchema.safeParse(body);

  if (!parseResult.success) {
    const firstError = parseResult.error.issues[0];
    return NextResponse.json(
      { message: firstError.message, field: firstError.path.join(".") },
      { status: 400 }
    );
  }

  const { phone, address, commission } = parseResult.data;

  // get cart with products populated
  const cart = await Cart.findOne({ userId: user.user._id }).populate(
    "items.product"
  );

  if (!cart || cart.items.length === 0)
    return NextResponse.json({ message: "Cart is empty" }, { status: 400 });

  // Group cart items by storeId
  const storeGroups: Record<string, typeof cart.items> = {};
  cart.items.forEach((item:CartItemPopulated) => {
    const storeId = item.product.storeId.toString();

    if (!storeGroups[storeId]) storeGroups[storeId] = [];
    storeGroups[storeId].push(item);
  });

  const createdOrders = [];

  // Loop over each store and create order
  for (const storeId in storeGroups) {
    const items = storeGroups[storeId];

    // 1️⃣ Create the order first
    const order = await Order.create({
      storeId,
      orderItems: [],
      phone,
      address,
      userId: user.user._id,
      isPaid: false,
      commission,
    });

    // 2️⃣ Create order items with correct productId and orderId
    const orderItemsIds = await Promise.all(
      items.map(async (item:OrderItemPopulated) => {
        const orderItem = await OrderItem.create({
          orderId: order._id,
          productId: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        });
        return orderItem._id;
      })
    );

    // 3️⃣ Update the order with the created items
    order.orderItems = orderItemsIds;
    await order.save();

    createdOrders.push(order);
  }

  // clear cart
  cart.items = [];
  await cart.save();

  return NextResponse.json({ orders: createdOrders }, { status: 201 });
}

export async function GET(req: NextRequest) {
  await connect();

  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const user = await getUsers({ token });
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    let query = {};

    // 🟢 CUSTOMER → orders بتاعته بس
    if (user.user.role === Role.CUSTOMER) {
      query = { userId: user.user._id };
    }

    // 🟠 VENDOR → orders الخاصة بالستور بتاعه
    if (user.user.role === Role.VENDOR) {
      query = { storeId: user.user.store };
    }

    const orders = await Order.find(query)
      .populate("storeId") // populate store details
      .populate("userId")
      .populate({
        path: "orderItems",
        populate: {
          path: "productId", // full product info
        },
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("GET orders error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
