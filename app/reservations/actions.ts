"use server";

import { prisma } from "../../app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createReservation(formData: FormData) {
  const roomId = parseInt(formData.get("roomId") as string);
  const userName = formData.get("userName") as string;
  const checkIn = new Date(formData.get("checkIn") as string);
  const checkOut = new Date(formData.get("checkOut") as string);

  // 임시로 관리자 계정 ID를 사용 (로그인 기능 연동 전까지)
  const user = await prisma.user.findFirst({ where: { loginId: "admin" } });

  if (!user) throw new Error("사용자를 찾을 수 없습니다.");

  try {
    // 1. 중복 예약 체크 (간단한 로직)
    const existing = await prisma.reservation.findFirst({
      where: {
        roomId,
        OR: [{ checkIn: { lte: checkOut }, checkOut: { gte: checkIn } }],
      },
    });

    if (existing) {
      return { error: "해당 날짜에 이미 예약이 존재합니다." };
    }

    // 2. DB 저장
    await prisma.reservation.create({
      data: {
        roomId,
        userId: user.id,
        userName,
        checkIn,
        checkOut,
        status: "CONFIRMED",
      },
    });

    // 3. 페이지 데이터 갱신
    revalidatePath("/reservations");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "저장 중 오류가 발생했습니다." };
  }
}
