// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 'export function middleware' 대신 'export default'를 사용해 보세요.
export default function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get("auth_token");
  const { pathname } = request.nextUrl;

  // 대시보드 보호 로직
  if (pathname.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      // 로그인이 안 되어 있으면 로그인 페이지로 리다이렉트
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: ["/dashboard/:path*"],
};
