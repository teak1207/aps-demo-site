// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 샘플 데이터 생성 시작...");

  // 1. 기존 데이터 삭제 (중복 생성 방지)
  await prisma.reservation.deleteMany();
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();

  // 2. 테스트 사용자 생성
  const user1 = await prisma.user.create({
    data: {
      loginId: "admin",
      password: "password123", // 실제 서비스에선 해싱 필요
      name: "관리자",
      role: "ADMIN",
      department: "운영팀",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      loginId: "user01",
      password: "password123",
      name: "홍길동",
      role: "USER",
      department: "개발팀",
    },
  });

  // 3. 객실 데이터 생성 (5개)
  const rooms = await prisma.room.createMany({
    data: [
      { name: "101호", type: "Standard", capacity: 2 },
      { name: "102호", type: "Standard", capacity: 2 },
      { name: "201호", type: "Deluxe", capacity: 4 },
      { name: "202호", type: "Deluxe", capacity: 4 },
      { name: "301호", type: "Suite", capacity: 6 },
    ],
  });

  // 4. 예약 데이터 생성 (테스트용 1개)
  // 방 ID를 가져오기 위해 다시 조회
  const firstRoom = await prisma.room.findFirst({ where: { name: "101호" } });

  if (firstRoom) {
    await prisma.reservation.create({
      data: {
        roomId: firstRoom.id,
        userId: user2.id,
        userName: user2.name,
        checkIn: new Date("2024-05-20T14:00:00Z"),
        checkOut: new Date("2024-05-22T11:00:00Z"),
        status: "CONFIRMED",
      },
    });
  }

  console.log("✅ 샘플 데이터 생성 완료!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
