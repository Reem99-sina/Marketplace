// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/connect";
import { User } from "@/models/User";
import { auth } from "@/lib/token"; // function to verify JWT
import { JwtPayload } from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    await connect();

    // 1️⃣ Get token from headers
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // 2️⃣ Verify token
    const payload = auth({ verifyToken: token }) as JwtPayload & { id: string };

    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // 3️⃣ Find user
    const user = await User.findById(payload.id).select("-password"); // exclude password
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: unknown) {
    let message = "Internal server error";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
