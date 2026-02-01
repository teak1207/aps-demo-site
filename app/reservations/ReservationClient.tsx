"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { createReservation } from "./actions";
import React, { useState } from "react";
import {
  CalendarDays,
  Home,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Check,
  User,
  Users,
} from "lucide-react";

interface Props {
  rooms: any[];
  dateRange: Date[];
}

export default function ReservationClient({ rooms, dateRange }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentViewDate = dateRange.length > 0 ? dateRange[0] : new Date();
  const currentYear = currentViewDate.getFullYear();
  const currentMonth = currentViewDate.getMonth() + 1;

  const handleMoveMonth = (offset: number) => {
    // 현재 보고 있는 연/월을 기준으로 새로운 Date 객체 생성 (일자는 1일로 고정하여 버그 방지)
    const newDate = new Date(currentYear, currentMonth - 1 + offset, 1);

    const newYear = newDate.getFullYear();
    const newMonth = newDate.getMonth() + 1;

    // 단순히 쿼리만 던지는 것보다 경로를 포함하는 것이 안전합니다.
    router.push(`/reservations?year=${newYear}&month=${newMonth}`);
  };

  const getDayDiff = (d1: Date | string, d2: Date | string) => {
    const start = new Date(d1);
    const end = new Date(d2);
    const diffTime = end.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <>
      {/* 1. 상단 헤더 영역 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <CalendarDays className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
            연수원 예약 현황
          </h2>
          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-sm font-bold text-gray-500">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div> 확정됨
            </span>
            <span className="flex items-center gap-1.5 text-sm font-bold text-gray-500">
              <div className="w-3 h-3 bg-amber-400 rounded-full"></div> 대기중
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleMoveMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-900"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-black px-2 text-gray-700 whitespace-nowrap">
              {currentYear}년 {currentMonth}월
            </span>
            <button
              onClick={() => handleMoveMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-900"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="hidden md:block w-px h-6 bg-gray-200 mx-2"></div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span className="whitespace-nowrap">예약</span>
          </button>
        </div>
      </div>
      {/* 2. 메인 컨텐츠 영역 */}
      <div className="bg-white rounded-4xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        {/* [모바일 버전] */}
        <div className="md:hidden p-6 space-y-4 bg-gray-50/50">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-black text-gray-600">
                  {room.name.replace(/[^0-9]/g, "")}
                </div>
                <h4 className="font-bold text-gray-900">{room.name}</h4>
              </div>
              <div className="space-y-2">
                {room.reservations?.length > 0 ? (
                  room.reservations.map((res: any) => (
                    <div
                      key={res.id}
                      className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex items-center justify-between"
                    >
                      <span className="text-sm font-bold text-emerald-900">
                        {res.userName}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600">
                        {new Date(res.checkIn).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-gray-300 italic text-center">
                    예약 없음
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* [데스크탑 버전] */}
        <div className="hidden md:block overflow-x-auto">
          <div className="min-w-400 bg-white">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `250px repeat(${dateRange.length}, 1fr)`,
              }}
              className="bg-gray-50/80 border-b border-gray-100"
            >
              <div className="p-6 font-black text-gray-400 uppercase tracking-widest text-[11px] flex items-center gap-2">
                <Home className="w-4 h-4" /> 객실 / 날짜
              </div>
              {dateRange.map((date, i) => (
                <div
                  key={i}
                  className={`p-4 text-center border-l border-gray-100 ${
                    date.getDay() === 0
                      ? "text-red-500"
                      : date.getDay() === 6
                      ? "text-blue-500"
                      : "text-gray-600"
                  }`}
                >
                  <p className="text-[10px] font-black opacity-40 uppercase">
                    {["일", "월", "화", "수", "목", "금", "토"][date.getDay()]}
                  </p>
                  <p className="text-xl font-black tracking-tighter">
                    {date.getDate()}
                  </p>
                </div>
              ))}
            </div>

            <div className="divide-y divide-gray-100">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: `250px repeat(${dateRange.length}, 1fr)`,
                  }}
                  className="group"
                >
                  <div className="p-6 bg-white border-r border-gray-100 flex items-center gap-4 group-hover:bg-blue-50/30 transition-colors">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center font-black text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                      {room.name.replace(/[^0-9]/g, "")}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg leading-tight">
                        {room.name}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                        {room.type}
                      </p>
                    </div>
                  </div>

                  {dateRange.map((currentDate, i) => {
                    const reservation = room.reservations?.find(
                      (res: any) =>
                        new Date(res.checkIn).toDateString() ===
                        currentDate.toDateString()
                    );

                    return (
                      <div
                        key={i}
                        className="border-l border-gray-50 h-28 relative hover:bg-gray-50/50 transition-colors cursor-pointer group/cell"
                      >
                        {reservation && (
                          <div
                            style={{
                              width: `${
                                getDayDiff(
                                  reservation.checkIn,
                                  reservation.checkOut
                                ) * 100
                              }%`,
                            }}
                            className="absolute inset-y-4 left-2 z-10 bg-emerald-500 text-white rounded-2xl p-4 shadow-xl border-4 border-white animate-in slide-in-from-left-2 overflow-hidden"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Users className="w-3 h-3" />
                              <p className="text-[10px] font-black uppercase opacity-80 tracking-widest">
                                Confirmed
                              </p>
                            </div>
                            <p className="text-sm font-black truncate">
                              {reservation.userName} 님
                            </p>
                          </div>
                        )}
                        {!reservation && (
                          <div className="absolute inset-0 opacity-0 group-hover/cell:opacity-100 flex items-center justify-center pointer-events-none">
                            <Plus className="w-4 h-4 text-blue-300" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>{" "}
      {/* ✅ 이 div 태그가 누락되어 에러가 발생했습니다. */}
      {/* 3. 예약 등록 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-xl shadow-2xl border border-white/20 animate-in zoom-in duration-300 overflow-hidden">
            <div className="p-10">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                    신규 예약 등록
                  </h3>
                  <p className="text-gray-500 font-medium mt-1">
                    객실 현황을 확인하고 예약을 진행하세요.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors text-gray-400 hover:text-gray-900"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form
                action={async (formData) => {
                  const checkInValue = formData.get("checkIn") as string;
                  const checkInDate = new Date(checkInValue);
                  const year = checkInDate.getFullYear();
                  const month = checkInDate.getMonth() + 1;

                  const result = await createReservation(formData);
                  if (result?.error) {
                    alert(result.error);
                  } else {
                    alert("예약이 완료되었습니다!");
                    setIsModalOpen(false);
                    // 쿼리 파라미터를 사용하여 해당 연/월로 이동
                    // router.push(`/reservations?year=${year}&month=${month}`);
                    router.replace(`/reservations?year=${year}&month=${month}`);
                  }
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">
                      예약자명
                    </label>
                    <input
                      name="userName"
                      required
                      type="text"
                      className="w-full px-6 py-4 bg-gray-50 rounded-[20px] outline-none font-bold focus:ring-4 focus:ring-blue-100 transition-all"
                      placeholder="홍길동"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">
                      객실 선택
                    </label>
                    <select
                      name="roomId"
                      className="w-full px-6 py-4 bg-gray-50 rounded-[20px] outline-none font-bold"
                    >
                      {rooms.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">
                      체크인
                    </label>
                    <input
                      name="checkIn"
                      required
                      type="date"
                      className="w-full px-6 py-4 bg-gray-50 rounded-[20px] outline-none font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">
                      체크아웃
                    </label>
                    <input
                      name="checkOut"
                      required
                      type="date"
                      className="w-full px-6 py-4 bg-gray-50 rounded-[20px] outline-none font-bold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-black text-white py-6 rounded-[28px] font-black text-xl transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
                >
                  <Check className="w-6 h-6" /> 예약 확정하기
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
