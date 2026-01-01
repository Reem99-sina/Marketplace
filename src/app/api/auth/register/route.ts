// app/api/auth/register/route.ts
// import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validation/register";
import connect from "@/lib/connect";
import { User } from "@/models/User";
import { createToken } from "@/lib/token";
import { ApiResponse } from "@/types/api";
import { RegisterResponseData } from "@/types/auth";

export async function POST(
  req: Request
): Promise<NextResponse<ApiResponse<RegisterResponseData>>> {
  try {
    await connect();
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );

    const { name, email, password, role } = parsed.data;

    const exists = await User.findOne({ email });
    if (exists)
      return NextResponse.json(
        {
          error: "Email already exists",
          success: false,
          message: "Email already exists",
        },
        { status: 409 }
      );

    const newUser = new User({
      name,
      email,
      password,
      role,
    });
    await newUser.save();
    const token = createToken({ id: newUser._id });
    const response = NextResponse.json({ newUser });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    return NextResponse.json({
      success: true,
      message: "User registered successfully",

      token,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
