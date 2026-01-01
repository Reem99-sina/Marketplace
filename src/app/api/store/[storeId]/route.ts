import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/connect";
import { Store } from "@/models/Store";
import { Product } from "@/models/Product";
import { getUsers } from "@/actions/getUser";
import { Role } from "@/models/Role";

interface Params {
  params: Promise<{ storeId: string }>;
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await connect();
    const { storeId } = await params;

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

    // Find store by ID and verify ownership
    const store = await Store.findOne({
      _id: storeId,
    });
    if (!store) {
      return NextResponse.json({ message: "Store not found" }, { status: 404 });
    }

    // Optional: delete all products associated with this store
    await Product.deleteMany({ storeId: storeId });

    // Delete the store
    await Store.findByIdAndDelete(store._id);

    return NextResponse.json({
      success: true,
      message: "Store deleted successfully",
    });
  } catch (error) {
    console.log("DELETE store error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
