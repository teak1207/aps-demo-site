import { prisma } from "../lib/prisma";
import CalendarWrapper from "./CalendarWrapper";

export default async function Reservation2Page() {
  const [rooms, reservations] = await Promise.all([
    prisma.room.findMany(),
    prisma.reservation.findMany({ include: { room: true } }),
  ]);

  // 색상 팔레트 (호실별로 세련된 색상 부여)
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  const initialEvents = reservations.map((res, index) => ({
    id: String(res.id),
    calendarId: String(res.roomId),
    title: res.userName,
    category: "time",
    start: res.checkIn.toISOString(),
    end: res.checkOut.toISOString(),
    backgroundColor: colors[res.roomId % colors.length],
    borderColor: "transparent",
    customStyle: { borderRadius: "4px", fontSize: "12px" },
  }));

  return (
    <main className="p-6 bg-[#f8fafc] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            예약 관리 시스템
          </h1>
          <p className="text-slate-500 mt-2">
            호실별 예약 현황을 한눈에 파악하고 관리하세요.
          </p>
        </header>

        {/* 캘린더 영역 */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
          <CalendarWrapper initialEvents={initialEvents} />
        </div>
      </div>
    </main>
  );
}
