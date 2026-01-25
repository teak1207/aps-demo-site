"use server";

import { prisma } from "../../lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const loginId = formData.get("loginId") as string;
  const password = formData.get("password") as string;

  // 1. DB에서 유저 조회 (loginId가 Unique해야 합니다)
  const user = await prisma.user.findUnique({
    where: { loginId: loginId },
  });

  // 2. 유저가 없거나 비밀번호가 틀린 경우
  // 클라이언트(page.tsx)에서 처리할 수 있도록 에러 객체를 리턴합니다.
  if (!user || user.password !== password) {
    return {
      success: false,
      message: "아이디 또는 비밀번호가 일치하지 않습니다.",
    };
  }

  // 3. [중요] 로그인 성공 시 쿠키 설정 (로그인 상태 유지)
  // 쿠키 이름은 'auth_token'으로 설정합니다.
  const cookieStore = await cookies();
  cookieStore.set("auth_token", user.id.toString(), {
    httpOnly: true, // 자바스크립트로 쿠키 탈취 방지 (보안)
    secure: process.env.NODE_ENV === "production", // HTTPS 권장
    maxAge: 60 * 60 * 24, // 1일 동안 유지
    path: "/", // 사이트 전체에서 사용
  });

  // 4. 대시보드로 리다이렉트
  // 반드시 "/"로 시작해야 절대 경로로 인식되어 404를 방지합니다.
  redirect("/dashboard");
}
