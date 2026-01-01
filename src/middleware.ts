// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const url = req.nextUrl.clone();

  if (!token ) {
    url.pathname = "/login"; 
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// export const config = {
//   matcher: ["/home/:path*", "/dashboard/:path*", "/game/:path*"],
// };

export const config = {
  matcher: ["/Home/:path*","/store/:path*","/profile/:path*","/product/:path*"],
};
