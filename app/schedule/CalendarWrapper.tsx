"use client";

import React, { useEffect, useState, useRef } from "react";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  LayoutGrid,
  List,
} from "lucide-react";

export default function ToastCalendarView({
  initialEvents,
}: {
  initialEvents: any[];
}) {
  const calendarRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentDate, setCurrentDate] = useState("");
  const [viewMode, setViewMode] = useState("month");

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const initCalendar = async () => {
      const Calendar = (await import("@toast-ui/calendar")).default;

      const instance = new Calendar(containerRef.current!, {
        defaultView: "month",
        useDetailPopup: true,
        useFormPopup: true,
        gridSelection: true,
        month: { dayNames: ["일", "월", "화", "수", "목", "금", "토"] },
        theme: {
          common: {
            border: "1px solid #e2e8f0",
            backgroundColor: "white",
            holiday: { color: "#ef4444" },
            saturday: { color: "#3b82f6" },
            dayname: { color: "#64748b" },
          },
        },
      });

      const formattedEvents = initialEvents.map((ev) => ({
        ...ev,
        start: new Date(ev.start),
        end: new Date(ev.end),
      }));

      instance.createEvents(formattedEvents);
      calendarRef.current = instance;
      updateDateText();
    };

    initCalendar();
    return () => calendarRef.current?.destroy();
  }, [initialEvents]);

  // 컨트롤러 함수들
  const updateDateText = () => {
    if (!calendarRef.current) return;
    const date = calendarRef.current.getDate();
    setCurrentDate(`${date.getFullYear()}년 ${date.getMonth() + 1}월`);
  };

  const move = (dir: "prev" | "next" | "today") => {
    if (!calendarRef.current) return;
    if (dir === "today") calendarRef.current.today();
    else if (dir === "prev") calendarRef.current.prev();
    else calendarRef.current.next();
    updateDateText();
  };

  const changeView = (mode: string) => {
    calendarRef.current?.changeView(mode);
    setViewMode(mode);
    updateDateText();
  };

  return (
    <div className="flex flex-col h-[850px] text-slate-700">
      {/* 커스텀 툴바 */}
      <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-800 min-w-[140px]">
            {currentDate}
          </h2>
          <div className="flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
            <button
              onClick={() => move("prev")}
              className="p-1.5 hover:bg-slate-100 rounded-md transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => move("today")}
              className="px-3 py-1 text-sm font-semibold hover:bg-slate-100 rounded-md transition-colors"
            >
              오늘
            </button>
            <button
              onClick={() => move("next")}
              className="p-1.5 hover:bg-slate-100 rounded-md transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
          <button
            onClick={() => changeView("month")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === "month"
                ? "bg-slate-900 text-white"
                : "hover:bg-slate-100"
            }`}
          >
            <LayoutGrid size={16} /> 월간
          </button>
          <button
            onClick={() => changeView("week")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === "week"
                ? "bg-slate-900 text-white"
                : "hover:bg-slate-100"
            }`}
          >
            <List size={16} /> 주간
          </button>
        </div>
      </div>

      {/* 캘린더 본체 */}
      <div className="flex-1 p-2">
        <div ref={containerRef} style={{ height: "100%" }} />
      </div>

      {/* 전역 스타일 오버라이드 */}
      <style jsx global>{`
        .toastui-calendar-layout {
          font-family: inherit !important;
        }
        .toastui-calendar-weekday-event {
          border-radius: 4px !important;
          font-size: 11px !important;
          padding: 2px 4px !important;
          font-weight: 600 !important;
        }
        .toastui-calendar-month-daygrid-inner {
          min-height: 100px !important;
        }
        .toastui-calendar-grid-cell-date {
          font-family: inherit !important;
          font-weight: 500 !important;
        }
        .toastui-calendar-detail-container {
          border-radius: 12px !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1) !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}
