"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const DUMMY_EVENTS = [
  { id: "1", title: "Instagram — Product launch", date: "2026-06-05", backgroundColor: "#e1306c", borderColor: "#e1306c" },
  { id: "2", title: "Twitter — Weekly tip", date: "2026-06-07", backgroundColor: "#1da1f2", borderColor: "#1da1f2" },
  { id: "3", title: "TikTok — Behind the scenes", date: "2026-06-10", backgroundColor: "#010101", borderColor: "#555" },
  { id: "4", title: "Instagram — Q&A session", date: "2026-06-12", backgroundColor: "#e1306c", borderColor: "#e1306c" },
  { id: "5", title: "Twitter — Thread", date: "2026-06-15", backgroundColor: "#1da1f2", borderColor: "#1da1f2" },
];

export function CalendarView() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 calendar-wrapper">
      <style>{`
        .calendar-wrapper .fc {
          --fc-border-color: #1f2937;
          --fc-button-bg-color: #374151;
          --fc-button-border-color: #374151;
          --fc-button-hover-bg-color: #4b5563;
          --fc-button-hover-border-color: #4b5563;
          --fc-button-active-bg-color: #4f6ef7;
          --fc-button-active-border-color: #4f6ef7;
          --fc-today-bg-color: rgba(79,110,247,0.08);
          --fc-page-bg-color: transparent;
          --fc-neutral-bg-color: #111827;
          --fc-list-event-hover-bg-color: #1f2937;
          color: #e5e7eb;
          font-family: inherit;
        }
        .calendar-wrapper .fc-toolbar-title { font-size: 1rem; font-weight: 600; }
        .calendar-wrapper .fc-col-header-cell { padding: 8px 0; font-size: 0.75rem; font-weight: 500; color: #6b7280; text-transform: uppercase; }
        .calendar-wrapper .fc-daygrid-day-number { color: #9ca3af; font-size: 0.8rem; padding: 4px 8px; }
        .calendar-wrapper .fc-event { border-radius: 4px; font-size: 0.75rem; padding: 1px 4px; cursor: pointer; }
        .calendar-wrapper .fc-button { font-size: 0.8rem !important; padding: 4px 10px !important; border-radius: 6px !important; }
        .calendar-wrapper .fc-day-today .fc-daygrid-day-number { color: #4f6ef7; font-weight: 600; }
      `}</style>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek",
        }}
        events={DUMMY_EVENTS}
        height="auto"
        editable
        selectable
        dayMaxEvents={3}
      />
    </div>
  );
}
