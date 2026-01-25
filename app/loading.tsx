// app/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center space-y-4">
        {/* 테일윈드로 만든 간단한 회전 로딩 아이콘 */}
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 font-medium">
          데이터를 불러오는 중입니다...
        </p>
      </div>
    </div>
  );
}
