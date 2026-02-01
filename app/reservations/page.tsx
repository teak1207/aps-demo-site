import { prisma } from "../../app/lib/prisma";
import ReservationClient from "./ReservationClient";

export const dynamic = "force-dynamic";

// ✅ 1. searchParams의 타입을 Promise로 변경해야 합니다.
export default async function ReservationsPage(props: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  // ✅ 2. 여기서 반드시 await를 해줘야 파라미터 값을 꺼낼 수 있습니다.
  const searchParams = await props.searchParams;

  // 1. URL 파라미터 읽기 (이제 값이 제대로 들어옵니다)
  const now = new Date();
  const year = searchParams.year
    ? parseInt(searchParams.year)
    : now.getFullYear();
  const month = searchParams.month
    ? parseInt(searchParams.month)
    : now.getMonth() + 1;

  // 2. 해당 월의 시작일(1일)과 마지막일(말일) 계산
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  // 3. DB 데이터 가져오기 (해당 월의 예약만 필터링)
  const rooms = await prisma.room.findMany({
    include: {
      reservations: {
        where: {
          OR: [{ checkIn: { lte: endDate }, checkOut: { gte: startDate } }],
        },
      },
    },
    orderBy: { name: "asc" },
  });

  // 4. 해당 월의 전체 날짜 배열 생성 (1일 ~ 말일)
  const totalDays = endDate.getDate();
  const dateRange = Array.from({ length: totalDays }, (_, i) => {
    return new Date(year, month - 1, i + 1);
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <ReservationClient rooms={rooms} dateRange={dateRange} />
    </div>
  );
}
