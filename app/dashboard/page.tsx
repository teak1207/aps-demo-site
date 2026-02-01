import { getWeatherData } from "./action";
import { getExchangeRate } from "./exchangeAction";
import { getNewsFeed } from "./newsAction";
import { prisma } from "../../app/lib/prisma";
import {
  Users,
  Newspaper,
  TrendingUp,
  CloudSun,
  ExternalLink,
  Clock,
} from "lucide-react";

export default async function DashboardPage() {
  const [userCount, weatherData, exchangeRate, newsList] = await Promise.all([
    prisma.user.count().catch(() => 0),
    getWeatherData().catch(() => null),
    getExchangeRate().catch(() => null),
    getNewsFeed().catch(() => []),
  ]);

  const safeNewsList = newsList || [];

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-gray-50 min-h-screen font-sans">
      <header>
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
          📊 비즈니스 대시보드
        </h2>
        <p className="text-sm md:text-base text-gray-500 mt-1 font-medium">
          실시간 주요 지표 및 뉴스 현황
        </p>
      </header>

      {/* 상단 3개 카드 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* 1. 전체 임직원 현황 */}
        <div className="bg-white p-5 md:p-6 rounded-[28px] shadow-sm border border-gray-100 flex items-center gap-4 md:gap-5">
          <div className="bg-blue-50 p-3 md:p-4 rounded-2xl">
            <Users className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
          </div>
          <div>
            <p className="text-[11px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">
              전체 사원
            </p>
            <p className="text-2xl md:text-3xl font-black text-gray-800 leading-none">
              {userCount}명
            </p>
          </div>
        </div>

        {/* 2. 환율 정보 (모바일 대응 최적화) */}
        <div className="bg-white p-5 md:p-6 rounded-[28px] shadow-sm border border-gray-100 flex items-center gap-4 md:gap-5">
          <div className="bg-emerald-50 p-3 md:p-4 rounded-2xl">
            <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[11px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">
              환율 (USD/KRW)
            </p>
            {/* 모바일에서 금액이 길어질 경우 대비해 text-xl~3xl 가변 적용 */}
            <p className="text-xl md:text-3xl font-black text-gray-800 leading-none truncate">
              {exchangeRate
                ? `₩${exchangeRate.toLocaleString()}`
                : "연동 중..."}
            </p>
          </div>
        </div>

        {/* 3. 날씨 정보 */}
        <div className="bg-gradient-to-br from-sky-500 to-indigo-600 p-5 md:p-6 rounded-[28px] shadow-lg text-white flex items-center justify-between">
          <div>
            <p className="text-[11px] md:text-xs font-bold opacity-70 uppercase tracking-widest mb-1">
              {weatherData?.name === "Hwaseong-si"
                ? "화성 동탄"
                : weatherData?.name || "위치 확인 중"}
            </p>
            <div className="flex items-end gap-2">
              <span className="text-3xl md:text-4xl font-black leading-none">
                {weatherData ? Math.round(weatherData.main.temp) : "--"}°
              </span>
              <span className="text-xs md:text-sm font-bold opacity-90 mb-1">
                {weatherData?.weather[0].description}
              </span>
            </div>
          </div>
          {weatherData && (
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt="날씨"
              className="w-14 h-14 md:w-16 md:h-16 drop-shadow-md"
            />
          )}
        </div>
      </div>

      {/* 하단 섹션: 뉴스 피드 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-4xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg md:text-xl font-black text-gray-800 flex items-center gap-2">
              <Newspaper className="w-5 h-5 md:w-6 md:h-6 text-blue-600" /> 주요
              비즈니스 뉴스
            </h3>
            <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
              실시간
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {safeNewsList.length > 0 ? (
              safeNewsList.map((news: any, idx: number) => (
                <a
                  key={idx}
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-gray-50/30 hover:bg-white p-5 rounded-2xl transition-all border border-gray-50 hover:border-blue-100 hover:shadow-md"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                          News
                        </span>
                        <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {news.publishedAt
                            ? new Date(news.publishedAt).toLocaleDateString()
                            : ""}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug md:text-lg">
                        {news.title}
                      </h4>
                      <p className="text-sm text-gray-500 font-medium">
                        {news.source?.name || news.source}
                      </p>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                </a>
              ))
            ) : (
              <div className="py-20 text-center">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Newspaper className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-400 font-bold">
                  최신 뉴스를 불러올 수 없습니다.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 사이드바 알림 (모바일에서도 가독성 좋게 변경) */}
        <div className="space-y-6">
          <div className="bg-gray-900 p-6 md:p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all"></div>
            <h3 className="text-lg font-black mb-6 relative z-10 flex items-center gap-2">
              📢 시스템 알림
            </h3>
            <ul className="space-y-5 relative z-10">
              <li className="flex gap-3">
                <div className="w-1 h-10 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-tighter">
                    Update
                  </p>
                  <p className="text-sm opacity-90 font-medium leading-snug">
                    사용자 관리 기능이 업데이트 되었습니다.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="w-1 h-10 bg-emerald-500 rounded-full"></div>
                <div>
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-tighter">
                    API Status
                  </p>
                  <p className="text-sm opacity-90 font-medium leading-snug">
                    실시간 환율 API 연동 완료
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="w-1 h-10 bg-amber-500 rounded-full"></div>
                <div>
                  <p className="text-xs font-bold text-amber-400 uppercase tracking-tighter">
                    Maintenance
                  </p>
                  <p className="text-sm opacity-90 font-medium leading-snug">
                    서버 안정성 점검 예정: 금일 오후 11시
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* 하단에 작은 안내 문구 추가 (사이드바 여백 채우기) */}
          <div className="p-6 bg-blue-50 rounded-[28px] border border-blue-100">
            <p className="text-xs font-bold text-blue-700 leading-relaxed">
              💡 대시보드 데이터는 10분마다 자동으로 갱신됩니다. 수동 갱신은
              브라우저 새로고침을 이용해 주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
