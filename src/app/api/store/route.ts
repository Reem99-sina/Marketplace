// app/api/vendor/store/route.ts
import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/connect";
import { Store } from "@/models/Store";

import { getUsers } from "@/actions/getUser";
import { Role } from "@/models/Role";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
  await connect();
  const { name } = await req.json();
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }
  if (!name)
    return NextResponse.json({ message: "Name required" }, { status: 400 });

  const user = await getUsers({ token }); // cast for NextRequestuest

  if (!user || user.user.role == Role.CUSTOMER)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const existingStore = await Store.findOne({ venderId: user.id });
  if (existingStore)
    return NextResponse.json(
      { message: "You already have a store" },
      { status: 400 }
    );

  const newStore = await Store.create({ name, venderId: user.user._id });
  await User.findByIdAndUpdate(user.user._id, {
    store: newStore._id,
  });
  return NextResponse.json({ store: newStore });
}

export async function GET(req: NextRequest) {
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
    return NextResponse.json({ store: null }, { status: 401 });
  try {
    let store;

    switch (user.user.role) {
      case Role.VENDOR:
        store = await Store.findOne({ venderId: user.user._id }).populate(
          "products venderId"
        );
        break;

      case Role.ADMIN:
        store = await Store.find().populate("products venderId");

        break;
    }

    return NextResponse.json({ store });
  } catch (error) {
    console.log("Error fetching store:", error);
    return NextResponse.json(
      { message: "Failed to fetch store data" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
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
  const store = await Store.findOneAndUpdate(
    { venderId: user.id },
    { name: body.name },
    { new: true }
  );

  return NextResponse.json({ store });
}
