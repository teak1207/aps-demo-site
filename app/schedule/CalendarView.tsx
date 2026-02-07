"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function CalendarView({ events }: { events: any[] }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-lg">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="ko"
        events={events}
        height="75vh"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek",
        }}
        dayMaxEvents={3} // 한 칸에 예약이 많으면 +more 표시
        eventClick={(info) => alert(`${info.event.title} 클릭됨`)}
      />
    </div>
  );
}
