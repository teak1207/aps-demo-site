// app/dashboard/actions.ts
"use server";

import { prisma } from "../../lib/prisma";
import { revalidatePath } from "next/cache";

// 1. 사용자 삭제 (Delete)
export async function deleteUser(id: number) {
  await prisma.user.delete({ where: { id } });
  revalidatePath("/dashboard"); // [특징] 데이터 변경 후 페이지를 즉시 갱신
}

// 2. 사용자 추가 (Create)
export async function createUser(formData: FormData) {
  const loginId = formData.get("loginId") as string;
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;
  const department = formData.get("department") as string;

  await prisma.user.create({
    data: {
      loginId,
      name,
      password,
      department, // 이 부분이 누락되었는지 확인하세요!
      role: "USER",
    },
  });
  revalidatePath("/dashboard");
}

// 사용자 정보 수정 (Update)
export async function updateUser(id: number, formData: FormData) {
  const name = formData.get("name") as string;
  const department = formData.get("department") as string;

  await prisma.user.update({
    where: { id },
    data: { name, department },
  });

  revalidatePath("/dashboard"); // 화면 갱신
}
