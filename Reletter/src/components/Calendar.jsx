import { useState } from "react";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function Calendar() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  const isToday = (day) => {
    return (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      day === today.getDate()
    );
  };

  const isSelected = (day) => {
    return (
      selectedDate &&
      selectedDate.year === year &&
      selectedDate.month === month &&
      selectedDate.day === day
    );
  };

  const dates = [];
  for (let i = 0; i < firstDay; i++) {
    dates.push(null);
  }
  for (let i = 1; i <= lastDate; i++) {
    dates.push(i);
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div style={{ padding: "24px", margin: "0 auto", height: "700px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <NavButton onClick={prevMonth}>⬅</NavButton>
          <h2 style={{ color: "#000000" }}>
            {year}년 {month + 1}월
          </h2>
          <NavButton onClick={nextMonth}>➡</NavButton>
        </div>

        {/* 요일 헤더 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "8px",
          }}
        >
          {days.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* 날짜 셀 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "4px",
            textAlign: "center",
            gridAutoRows: "100px",
          }}
        >
          {dates.map((day, index) => (
            <div
              key={index}
              onClick={() => day && setSelectedDate({ year, month, day })}
              style={{
                padding: "12px 0",
                backgroundColor: isToday(day) ? "#fde8ec" : "#fff",
                border: isSelected(day)
                  ? "2px solid #d94673"
                  : "1px solid #eee",
                borderRadius: "8px",
                color: day ? "#333" : "transparent",
                cursor: day ? "pointer" : "default",
              }}
            >
              {day || ""}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NavButton({ onClick, children }) {
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        backgroundColor: hover ? "#fde8ec" : "#ffffff",
        border: "1.5px solid #d94673",
        borderRadius: "8px",
        padding: "6px 12px",
        color: "#d94673",
        fontSize: "16px",
        cursor: "pointer",
        transition: "background 0.2s ease-in-out",
      }}
    >
      {children}
    </button>
  );
}

export default Calendar;
