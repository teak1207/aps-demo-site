// app/dashboard/layout.tsx
import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link"; // Next.js 최적화 링크

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get("auth_token");

  if (!isLoggedIn) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 상단 네비게이션 바 */}
      <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* 로고 영역 */}
            <div className="flex items-center">
              <Link
                href="/dashboard"
                className="text-xl md:text-2xl font-black text-blue-600 tracking-tight"
              >
                APS <span className="text-gray-800"></span>
              </Link>

              {/* PC용 메뉴 (모바일에서는 숨김) */}
              <nav className="hidden md:ml-10 md:flex space-x-6">
                <Link
                  href="/dashboard"
                  className="text-gray-900 px-3 py-2 font-bold hover:text-blue-600 transition"
                >
                  대시보드
                </Link>
                <Link
                  href="/dashboard/users"
                  className="text-gray-500 hover:text-blue-600 px-3 py-2 font-bold transition"
                >
                  사용자 관리
                </Link>
              </nav>
            </div>

            {/* 사용자 정보 및 로그아웃 */}
            <div className="flex items-center gap-2 md:gap-4">
              <span className="hidden sm:inline-block text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                관리자 님
              </span>

              {/* 로그아웃 버튼 (서버 액션 연결 예정) */}
              <form
                action={async () => {
                  "use server";
                  const cookieStore = await cookies();
                  cookieStore.delete("auth_token");
                  redirect("/login");
                }}
              >
                <button
                  type="submit"
                  className="text-xs md:text-sm bg-red-50 hover:bg-red-500 hover:text-white text-red-600 font-bold py-2 px-3 md:px-4 rounded-lg border border-red-200 transition-all"
                >
                  로그아웃
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 영역 (모바일 여백 최적화) */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 min-h-[80vh] p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* 하단 푸터 */}
      <footer className="bg-gray-100 border-t border-gray-200 py-6 text-center">
        <p className="text-xs md:text-sm text-gray-500 font-medium">
          © 2026 APS Company. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
