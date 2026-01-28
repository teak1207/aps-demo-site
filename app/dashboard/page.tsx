// app/dashboard/page.tsx
import { getWeatherData } from "./action"; // 🔍 여기서 파일명이 action인지 actions인지 꼭 확인!
import { getExchangeRate } from "./exchangeAction";
import { getNewsFeed } from "./newsAction";
import { prisma } from "../../app/lib/prisma";
import {
  Users,
  Newspaper,
  TrendingUp,
  CloudSun,
  ExternalLink,
} from "lucide-react";

export default async function DashboardPage() {
  // 데이터 병렬 호출
  const [userCount, weatherData, exchangeRate, newsList] = await Promise.all([
    prisma.user.count().catch(() => 0),
    getWeatherData().catch(() => null),
    getExchangeRate().catch(() => null),
    getNewsFeed().catch(() => []),
  ]);

  // 안전장치: 데이터가 없을 경우 빈 값 처리
  const safeNewsList = newsList || [];

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <header>
        <h2 className="text-3xl font-black text-gray-900">
          📊 비즈니스 대시보드
        </h2>
        <p className="text-gray-500 mt-1">실시간 주요 지표 및 뉴스 현황</p>
      </header>

      {/* 상단 3개 카드 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. 전체 임직원 현황 */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="bg-blue-50 p-4 rounded-2xl">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              전체 사원
            </p>
            <p className="text-3xl font-black text-gray-800">{userCount}명</p>
          </div>
        </div>

        {/* 2. 환율 정보 */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="bg-emerald-50 p-4 rounded-2xl">
            <TrendingUp className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              환율 (USD/KRW)
            </p>
            <p className="text-3xl font-black text-gray-800">
              {exchangeRate
                ? `₩${exchangeRate.toLocaleString()}`
                : "연동 중..."}
            </p>
          </div>
        </div>

        {/* 3. 날씨 정보 */}
        <div className="bg-gradient-to-br from-sky-400 to-blue-600 p-6 rounded-3xl shadow-lg text-white flex items-center justify-between">
          <div>
            <p className="text-sm font-bold opacity-80 uppercase tracking-wider">
              {weatherData?.name === "Hwaseong-si"
                ? "화성 동탄"
                : weatherData?.name || "위치 확인 중"}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-black">
                {weatherData ? Math.round(weatherData.main.temp) : "--"}°
              </span>
              <span className="text-sm font-medium opacity-90">
                {weatherData?.weather[0].description}
              </span>
            </div>
          </div>
          {weatherData && (
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt="날씨"
              className="w-16 h-16 drop-shadow-md"
            />
          )}
        </div>
      </div>

      {/* 하단 섹션: 뉴스 피드 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-black text-gray-800 flex items-center gap-2 mb-6">
            <Newspaper className="w-6 h-6 text-gray-400" /> 주요 비즈니스 뉴스
          </h3>
          <div className="space-y-6">
            {/* 🔍 여기서 newsList 대신 safeNewsList를 사용하여 에러 방지 */}
            {safeNewsList.length > 0 ? (
              safeNewsList.map((news: any, idx: number) => (
                <a
                  key={idx}
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="flex justify-between items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                    <div className="space-y-1">
                      <h4 className="font-bold text-gray-700 group-hover:text-blue-600 transition-colors line-clamp-1 text-lg">
                        {news.title}
                      </h4>
                      <p className="text-sm text-gray-400 flex items-center gap-2">
                        <span className="font-semibold text-gray-500">
                          {news.source?.name || news.source}
                        </span>
                        <span>•</span>
                        <span>
                          {news.publishedAt
                            ? new Date(news.publishedAt).toLocaleDateString()
                            : ""}
                        </span>
                      </p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </a>
              ))
            ) : (
              <div className="py-10 text-center text-gray-400">
                최신 뉴스를 가져오는 중이거나 데이터가 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* 사이드바 알림 */}
        <div className="bg-gray-800 p-8 rounded-3xl text-white shadow-xl">
          <h3 className="text-lg font-bold mb-4">📢 시스템 알림</h3>
          <ul className="space-y-4 text-sm opacity-80">
            <li className="border-l-2 border-blue-400 pl-3">
              사용자 관리 기능이 업데이트 되었습니다.
            </li>
            <li className="border-l-2 border-emerald-400 pl-3">
              실시간 환율 API 연동 완료
            </li>
            <li className="border-l-2 border-amber-400 pl-3">
              서버 안정성 점검 예정: 금일 오후 11시
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
