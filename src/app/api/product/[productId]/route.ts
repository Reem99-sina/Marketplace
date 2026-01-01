import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/connect";
import { Product } from "@/models/Product";
import { Store } from "@/models/Store";
import { getUsers } from "@/actions/getUser";
import { Role } from "@/models/Role";
import { productSchema } from "@/lib/validation/product";
const updateProductSchema = productSchema.partial();

type Params = {
  params: Promise<{
    productId: string;
  }>;
};

export async function PUT(req: NextRequest, { params }: Params) {
  await connect();
  const { productId } = await params;
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  const user = await getUsers({ token });
  if (!user || user.user.role == Role.CUSTOMER) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const parsed = updateProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Validation error",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const store = await Store.findOne({ venderId: user.user._id });
  if (!store) {
    return NextResponse.json({ message: "Store not found" }, { status: 404 });
  }

  const product = await Product.findOneAndUpdate(
    { _id: productId, storeId: store._id },
    parsed.data,
    { new: true }
  );

  if (!product) {
    return NextResponse.json(
      { message: "Product not found or unauthorized" },
      { status: 404 }
    );
  }

  return NextResponse.json({ product });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  await connect();
  const { productId } = await params;
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  const user = await getUsers({ token });
  if (!user || user.user.role == Role.CUSTOMER) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const store = await Store.findOne({ venderId: user.user._id });
  if (!store) {
    return NextResponse.json({ message: "Store not found" }, { status: 404 });
  }

  const product = await Product.findOneAndDelete({
    _id: productId,
    storeId: store._id,
  });

  if (!product) {
    return NextResponse.json(
      { message: "Product not found or unauthorized" },
      { status: 404 }
    );
  }
  await Store.findByIdAndUpdate(store._id, {
    $pull: { products: product._id },
  });
  return NextResponse.json({ success: true });
}
