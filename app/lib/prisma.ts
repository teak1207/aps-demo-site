// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// NodeJS 전역 객체에 prisma 인스턴스를 저장하기 위한 타입 정의
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 이미 생성된 인스턴스가 있으면 재사용하고, 없으면 새로 생성합니다.
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"], // 터미널 콘솔에 실행되는 SQL문을 출력 (디버깅에 매우 유용!)
  });

// 개발 환경(development)일 때만 전역 객체에 저장하여 재사용합니다.
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
