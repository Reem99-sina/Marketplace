import { NextResponse } from "next/server";
import connect from "@/lib/connect";
import { Product } from "@/models/Product";
import { Store } from "@/models/Store";

type Params = {
  params: Promise<{ storeId: string }>
};

export async function GET(req: Request, { params }: Params) {
  await connect();

  const { storeId } =await params;

  const store = await Store.findById(storeId);
  if (!store) {
    return NextResponse.json({ message: "Store not found" }, { status: 404 });
  }
  const products = await Product.find({
    storeId,
    isArchived: false, // مهم
  }).sort({ createdAt: -1 });

  return NextResponse.json({ products });
}
