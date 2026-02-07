"use client";

import { useState } from "react";
import { loginAction } from "../login/actions"; // 위에서 만든 액션 임포트

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  // 클라이언트 측 핸들러
  async function handleForm(formData: FormData) {
    setError(null); // 이전 에러 초기화

    const result = await loginAction(formData);

    // 서버(actions.ts)에서 return한 객체 구조에 맞게 체크
    if (result && result.success === false) {
      // 1. 상태값(setError)에 저장해서 화면에 빨간 글씨로 띄우기
      setError(result.message);

      // 2. (선택사항) 브라우저 알림창으로도 띄우고 싶다면
      // alert(result.message);
    } else if (result && result.success === true) {
      // 성공 시 대시보드로 이동
      window.location.href = "/dashboard";
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          자체개발 시스템
        </h2>

        {/* 에러 메시지 표시창 */}
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center border border-red-200">
            {error}
          </div>
        )}

        <form action={handleForm} className="mt-8 space-y-6">
          <div className="space-y-4">
            <input
              name="loginId" // FormData에서 읽을 이름
              type="text"
              required
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500"
              placeholder="아이디"
            />
            <input
              name="password"
              type="password"
              required
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500"
              placeholder="비밀번호 "
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
