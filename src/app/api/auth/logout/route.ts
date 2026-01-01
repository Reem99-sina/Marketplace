// src/app/api/auth/logout/route.ts
import { getUsers } from "@/actions/getUser";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // مسح الكوكيز الخاصة بالتوكن
  const response = NextResponse.json({ message: "Logged out successfully" });
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  // إعادة تعيين الكوكيز لتصبح فارغة وتنتهي صلاحيتها

  const user = await getUsers({ token });
  if (user) {
    // تحديث حالة المستخدم ليصبح غير نشط
    await User.findByIdAndUpdate(user._id, { isActive: false });
  }
  response.cookies.set({
    name: "token",
    value: "",
    path: "/",
    httpOnly: true,
    maxAge: 0, // تعني انتهاء الصلاحية فورًا
  });

  return response;
}
