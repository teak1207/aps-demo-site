// app/dashboard/layout.tsx
import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 레이아웃에서도 보안 체크 (쿠키가 없으면 로그인으로 튕김)
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get("auth_token");

  if (!isLoggedIn) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 상단 네비게이션 바 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold text-blue-600">My Demo App</span>
            <nav className="ml-10 flex space-x-4">
              <a
                href="/dashboard"
                className="text-gray-900 px-3 py-2 font-medium"
              >
                대시보드
              </a>
              <a
                href="/dashboard/users"
                className="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium"
              >
                사용자 관리
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 font-medium">관리자 님</span>
            <button className="text-sm text-red-500 hover:underline">
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 w-full">
        {children}
      </main>

      {/* 하단 푸터 */}
      <footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-400">
        © 2026 My Company. Demo Project.
      </footer>
    </div>
  );
}
