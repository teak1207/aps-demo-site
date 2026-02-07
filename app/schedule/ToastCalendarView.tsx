"use client";

import React, { useEffect, useState, useRef } from "react";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Maximize2,
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

    const isMobile = window.innerWidth < 768;

    const initCalendar = async () => {
      const Calendar = (await import("@toast-ui/calendar")).default;

      const instance = new Calendar(containerRef.current!, {
        // 모바일 접속 시 'day' 혹은 'week'로 시작하도록 설정 가능
        defaultView: isMobile ? "day" : "month",
        useDetailPopup: true,
        useFormPopup: true,
        month: {
          dayNames: ["일", "월", "화", "수", "목", "금", "토"],
          narrowWeekend: true,
        },
        week: {
          taskView: false,
          dayNames: ["일", "월", "화", "수", "목", "금", "토"],
        },
        // 일간(Day) 뷰를 위한 명시적 설정
        day: {
          taskView: false,
        },
      } as any);

      const formattedEvents = initialEvents.map((ev) => ({
        ...ev,
        start: new Date(ev.start),
        end: new Date(ev.end),
      }));

      instance.createEvents(formattedEvents);
      calendarRef.current = instance;
      updateDateText();
      setViewMode(isMobile ? "day" : "month");
    };

    initCalendar();
    return () => calendarRef.current?.destroy();
  }, [initialEvents]);

  const updateDateText = () => {
    if (!calendarRef.current) return;
    const date = calendarRef.current.getDate();
    // 일간 뷰일 때는 상세 날짜까지 표시
    const mode = calendarRef.current.getViewName();
    if (mode === "day") {
      setCurrentDate(
        `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`
      );
    } else {
      setCurrentDate(`${date.getFullYear()}. ${date.getMonth() + 1}`);
    }
  };

  const move = (dir: "prev" | "next" | "today") => {
    if (!calendarRef.current) return;
    if (dir === "today") calendarRef.current.today();
    else if (dir === "prev") calendarRef.current.prev();
    else calendarRef.current.next();
    updateDateText();
  };

  const changeView = (mode: string) => {
    if (!calendarRef.current) return;
    calendarRef.current.changeView(mode);
    setViewMode(mode);
    updateDateText();
  };

  return (
    <div className="flex flex-col h-[85vh] md:h-[800px] bg-white">
      {/* 상단 컨트롤러 (모바일 최적화) */}
      <div className="flex flex-col gap-3 p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">{currentDate}</h2>
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => move("prev")}
              className="p-2 hover:bg-white rounded-md transition-all shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => move("today")}
              className="px-3 py-1 text-sm font-bold"
            >
              오늘
            </button>
            <button
              onClick={() => move("next")}
              className="p-2 hover:bg-white rounded-md transition-all shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* 뷰 전환 탭 (모바일에서 크게 보이도록) */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 rounded-xl p-1">
          <button
            onClick={() => changeView("month")}
            className={`flex items-center justify-center py-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === "month"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500"
            }`}
          >
            <LayoutGrid size={14} className="mr-1" /> 월간
          </button>
          <button
            onClick={() => changeView("week")}
            className={`flex items-center justify-center py-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === "week"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500"
            }`}
          >
            <List size={14} className="mr-1" /> 주간
          </button>
          <button
            onClick={() => changeView("day")}
            className={`flex items-center justify-center py-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === "day"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500"
            }`}
          >
            <Maximize2 size={14} className="mr-1" /> 일간
          </button>
        </div>
      </div>

      {/* 캘린더 본체 */}
      <div className="flex-1 overflow-hidden relative">
        <div ref={containerRef} className="h-full" />
      </div>

      <style jsx global>{`
        /* 일간 뷰 시간 슬롯 높이 조절 */
        .toastui-calendar-timegrid-hour-resizer {
          height: 60px !important;
        }
        .toastui-calendar-day-name-item {
          font-size: 14px !important;
          font-weight: 700 !important;
        }
        .toastui-calendar-grid-selection {
          background-color: rgba(59, 130, 246, 0.1) !important;
        }
      `}</style>
    </div>
  );
}
