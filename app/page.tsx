// app/page.tsx
import Link from "next/link";
import { cookies } from "next/headers";

export default async function HomePage() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get("auth_token");

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* 히어로 섹션 */}
      <section className="pt-20 pb-32 px-4 text-center bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
            임직원 관리를 <br />
            <span className="text-blue-600">더 스마트하게.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            APS SITE는 직관적인 UI와 실시간 데이터 동기화를 통해
            <br className="hidden md:block" />
            기업의 인사 관리를 혁신적으로 단순화합니다.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-4">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-xl transition-all"
              >
                대시보드로 바로가기 →
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-xl transition-all"
                >
                  지금 시작하기
                </Link>
                <button className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all">
                  서비스 소개서 보기
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 특징 요약 섹션 */}
      <section className="py-20 max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-12">
        <div className="p-8 bg-gray-50 rounded-3xl">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 font-bold text-2xl">
            📱
          </div>
          <h3 className="text-xl font-bold mb-3">모바일 최적화</h3>
          <p className="text-gray-600">
            언제 어디서나 스마트폰으로 임직원 정보를 확인하고 수정하세요.
          </p>
        </div>
        <div className="p-8 bg-gray-50 rounded-3xl">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6 font-bold text-2xl">
            ⚡
          </div>
          <h3 className="text-xl font-bold mb-3">실시간 동기화</h3>
          <p className="text-gray-600">
            Server Actions를 통한 빠른 데이터 갱신으로 딜레이 없는 업무 환경을
            보장합니다.
          </p>
        </div>
        <div className="p-8 bg-gray-50 rounded-3xl">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6 font-bold text-2xl">
            🔒
          </div>
          <h3 className="text-xl font-bold mb-3">철저한 보안</h3>
          <p className="text-gray-600">
            쿠키 기반의 인증 시스템과 서버 측 보안 검증으로 데이터를 안전하게
            보호합니다.
          </p>
        </div>
      </section>
    </div>
  );
}
