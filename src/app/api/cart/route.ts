import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/connect";
import { Cart, CartItemPopulated } from "@/models/Cart";
import { Product } from "@/models/Product";
import { getUsers } from "@/actions/getUser";
import { Role } from "@/models/Role";

export async function GET(req: NextRequest) {
  await connect();
  const token = req.cookies.get("token")?.value;

  if (!token)
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );

  const user = await getUsers({ token });
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const cart = await Cart.findOne({ userId: user.user._id }).populate(
      "items.product"
    );
    return NextResponse.json({ cart });
  } catch (error) {
    console.log("GET cart error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  await connect();
  const token = req.cookies.get("token")?.value;

  if (!token)
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );

  const user = await getUsers({ token });
  if (!user || user.user.role !== Role.CUSTOMER)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { productId, quantity } = body;

  if (!productId || quantity < 1) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  try {
    // Ensure product exists
    const product = await Product.findById(productId);
    if (!product)
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );

    let cart = await Cart.findOne({ userId: user.user._id });
    if (!cart) {
      cart = await Cart.create({
        userId: user.user._id,
        items: [{ product: product._id, quantity }],
      });
    } else {
      const existingItem = cart.items.find(
        (item: CartItemPopulated) => item.product.toString() === productId
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: product._id, quantity });
      }
      await cart.save();
    }

    return NextResponse.json({ cart });
  } catch (error) {
    console.log("POST cart error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  await connect();
  const token = req.cookies.get("token")?.value;

  if (!token)
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );

  const user = await getUsers({ token });
  if (!user || user.user.role !== Role.CUSTOMER)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const productId = url.searchParams.get("productId");

  if (!productId)
    return NextResponse.json(
      { message: "ProductId required" },
      { status: 400 }
    );

  try {
    const cart = await Cart.findOne({ userId: user.user._id }).populate(
      "items.product"
    );
    if (!cart)
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    const itemIndex = cart.items.findIndex(
      (item: CartItemPopulated) => item.product._id.toString() === productId
    );

    if (itemIndex === -1)
      return NextResponse.json(
        { message: "Product not found in cart" },
        { status: 404 }
      );

    // ✅ reduce quantity or remove item
    if (cart.items[itemIndex].quantity > 1) {
      cart.items[itemIndex].quantity -= 1;
    } else {
      cart.items.splice(itemIndex, 1);
    }
    await cart.save();

    return NextResponse.json({ cart });
  } catch (error) {
    console.log("DELETE cart error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Optional: Clear entire cart
export async function PATCH(req: NextRequest) {
  await connect();
  const token = req.cookies.get("token")?.value;

  if (!token)
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );

  const user = await getUsers({ token });
  if (!user || user.user.role !== Role.CUSTOMER)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const cart = await Cart.findOne({ userId: user.user._id });
    if (!cart)
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });

    cart.items = [];
    await cart.save();

    return NextResponse.json({ cart });
  } catch (error) {
    console.log("PATCH cart error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
