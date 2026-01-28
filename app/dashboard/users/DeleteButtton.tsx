"use client"; // 이 버튼은 브라우저에서 동작함을 선언

import { deleteUser } from "./actions";

export default function DeleteButton({ userId }: { userId: number }) {
  const handleDelete = async () => {
    // 윈도우 팝업(confirm)은 클라이언트 컴포넌트에서만 가능합니다.
    if (confirm("정말 삭제하시겠습니까?")) {
      await deleteUser(userId);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm font-bold shadow-sm"
    >
      삭제
    </button>
  );
}
