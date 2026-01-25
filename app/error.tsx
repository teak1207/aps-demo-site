"use client"; // 이 줄이 반드시 맨 위에 있어야 합니다!

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 에러를 콘솔에 기록하거나 로그 서비스에 전송
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        문제가 발생했습니다!
      </h2>
      <button
        onClick={() => reset()} // 페이지 다시 시도
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        다시 시도하기
      </button>
    </div>
  );
}
