// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/connect";
import { User } from "@/models/User";
import { createToken } from "@/lib/token";
import { ApiResponse } from "@/types/api";
import { LoginResponseData } from "@/types/auth";
import { loginSchema } from "@/lib/validation/login";
import { getUsers } from "@/actions/getUser";

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse<LoginResponseData>>> {
  try {
    await connect();
    const body = await req.json();

    // Validate input
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password); // Make sure you have a comparePassword method in User model
    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Create JWT
    const token = createToken({ id: user._id });

    // Set cookie
    const response = NextResponse.json({
      success: true,
      message: "Logged in successfully",
      token,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return response;
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

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) return new Response("Unauthorized", { status: 401 });

  const user = await getUsers({ token }); // دالة تجيب بيانات المستخدم من DB

  return new Response(JSON.stringify(user), { status: 200 });
}
