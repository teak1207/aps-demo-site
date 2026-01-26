// app/dashboard/page.tsx
import { prisma } from "../lib/prisma";
import { createUser, updateUser } from "./actions"; // 경로 확인: 현재 폴더의 actions.ts
import DeleteButton from "./DeleteButtton"; // 방금 만든 클라이언트 버튼

export default async function DashboardPage() {
  // 서버에서 유저 목록 가져오기
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-4 md:p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* 헤더 섹션 */}
      <div className="border-b border-gray-300 pb-4">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
          👤 임직원 관리
        </h2>
        <p className="text-sm md:text-base text-gray-600 mt-2">
          모바일과 PC 어디서든 수정이 가능합니다.
        </p>
      </div>

      {/* 등록 폼 (Create) - 모바일에서는 세로, PC에서는 가로 레이아웃 */}
      <section className="bg-white p-5 rounded-xl border-2 border-blue-500 shadow-md">
        <h3 className="text-lg font-bold text-blue-700 mb-4">신규 등록</h3>
        <form action={createUser} className="flex flex-col md:flex-row gap-3">
          <input
            name="loginId"
            placeholder="아이디"
            className="border-2 border-gray-300 p-2 rounded-lg flex-1 text-gray-900 font-medium"
            required
          />
          <input
            name="name"
            placeholder="성명"
            className="border-2 border-gray-300 p-2 rounded-lg flex-1 text-gray-900 font-medium"
            required
          />
          <input
            name="department"
            placeholder="부서명"
            className="border-2 border-gray-300 p-2 rounded-lg flex-1 text-gray-900 font-medium"
          />
          <input
            name="password"
            type="password"
            placeholder="비밀번호"
            className="border-2 border-gray-300 p-2 rounded-lg flex-1 text-gray-900 font-medium"
            required
          />
          <button
            type="submit"
            className="bg-blue-700 text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-800 transition-all"
          >
            등록
          </button>
        </form>
      </section>

      {/* 목록 섹션 (반응형 테이블/카드) */}
      <section className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-300">
        {/* 1. PC용 테이블 뷰 (md 이상에서 노출) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-800 text-white font-bold">
              <tr>
                <th className="p-5 w-1/4 text-center">아이디</th>
                <th className="p-5 w-1/4">성명</th>
                <th className="p-5 w-1/4">부서명</th>
                <th className="p-5 w-1/4 text-center">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-100">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-blue-50 transition-colors"
                >
                  <td className="p-5 text-center font-black text-gray-900">
                    {user.loginId}
                  </td>
                  <td colSpan={3} className="p-0">
                    <form
                      action={updateUser.bind(null, user.id)}
                      className="flex items-center w-full p-5 gap-6"
                    >
                      <input
                        name="name"
                        defaultValue={user.name}
                        className="text-gray-800 font-bold border-b-2 border-transparent focus:border-blue-600 outline-none p-1 w-32 bg-transparent"
                      />
                      <input
                        name="department"
                        defaultValue={user.department || ""}
                        className="text-gray-800 font-bold border-b-2 border-transparent focus:border-blue-600 outline-none p-1 flex-1 bg-transparent"
                        placeholder="부서 미지정"
                      />
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md font-bold text-sm"
                        >
                          저장
                        </button>
                        <DeleteButton userId={user.id} />
                      </div>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 2. 모바일용 카드 뷰 (md 미만에서 노출) */}
        <div className="md:hidden divide-y-4 divide-gray-100">
          {users.map((user) => (
            <div key={user.id} className="p-5 bg-white space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-blue-700 font-black text-xl">
                  {user.loginId}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>

              <form
                action={updateUser.bind(null, user.id)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      성명
                    </label>
                    <input
                      name="name"
                      defaultValue={user.name}
                      className="border-2 border-gray-200 p-2 rounded-lg text-gray-900 font-bold focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      부서
                    </label>
                    <input
                      name="department"
                      defaultValue={user.department || ""}
                      className="border-2 border-gray-200 p-2 rounded-lg text-gray-900 font-bold focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold shadow-md active:bg-green-800"
                  >
                    저장
                  </button>
                  <DeleteButton userId={user.id} />
                </div>
              </form>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
