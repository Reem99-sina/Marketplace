// app/api/vendor/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/connect";
import { Product } from "@/models/Product";
import { Store } from "@/models/Store";
import { getUsers } from "@/actions/getUser";
import { Role } from "@/models/Role";
import { productSchema } from "@/lib/validation/product";


export async function POST(req: NextRequest) {
  await connect();
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }
  const user = await getUsers({ token });
  if (!user || user.user.role == Role.CUSTOMER)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Validation error",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }
  const { name, price, isFeatured, isArchived } = parsed.data;
  const store = await Store.findOne({ venderId: user.user._id });
  if (!store)
    return NextResponse.json({ message: "Store not found" }, { status: 404 });

  const product = await Product.create({
    name,
    price,
    storeId: store._id,
    store: store._id,
    isFeatured: !!isFeatured,
    isArchived: !!isArchived,
  });

  store.products.push(product._id);
  await store.save();

  return NextResponse.json({ product });
}

export async function GET() {
  try {
    await connect();

    // Get all products from all stores
    const products = await Product.find().populate({
      path: "store",
      populate: {
        path: "venderId",
        select: "name",
      },
    });

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.log("GET products error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
