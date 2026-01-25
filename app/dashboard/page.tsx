// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800">📊 관리자 대시보드</h1>
        <p className="mt-4 text-gray-600">
          로그인에 성공하셨습니다! 이제 이곳에 데이터를 시각화하거나 추가적인
          관리 기능을 구현하면 됩니다.
        </p>

        <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700">
          2월 13일 데모를 위한 기본 세팅이 완료되었습니다.
        </div>
      </div>
    </div>
  );
}
