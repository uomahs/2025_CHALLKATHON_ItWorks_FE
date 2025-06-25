import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function Calendar() {
  const navigate = useNavigate();

  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [unreadSummary, setUnreadSummary] = useState({});
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  useEffect(() => {
    const fetchUnreadSummary = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/diaries/count-by-date?year=${year}&month=${String(
            month + 1
          ).padStart(2, "0")}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        setUnreadSummary(res.data);
      } catch (error) {
        console.error("❌ 읽지 않은 요약 불러오기 실패:", error);
      }
    };

    fetchUnreadSummary();
  }, [year, month]);

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
          {dates.map((day, index) => {
            const formattedDate = `${year}-${String(month + 1).padStart(
              2,
              "0"
            )}-${String(day).padStart(2, "0")}`;
            const unreadCount = unreadSummary[formattedDate] || 0;
            const groupCount = unreadSummary[formattedDate]?.groupCount || 0;

            return (
              <div
                key={index}
                onClick={() => {
                  if (day) {
                    setSelectedDate({ year, month, day });
                    navigate(`/diary/${formattedDate}`);
                  }
                }}
                style={{
                  padding: "8px",
                  backgroundColor: isToday(day) ? "#fde8ec" : "#fff",
                  border: isSelected(day)
                    ? "2px solid #d94673"
                    : "1px solid #eee",
                  borderRadius: "8px",
                  color: day ? "#333" : "transparent",
                  cursor: day ? "pointer" : "default",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                  {day || ""}
                </div>

                {day && unreadCount > 0 && (
                  <div
                    style={{
                      fontSize: "15px",
                      color: "#d94673",
                      paddingBottom: "25px",
                    }}
                  >
                    {" "}
                    💌 미열람 일기 {unreadCount}개
                  </div>
                )}

                {day && unreadCount === 0 && (
                  <div
                    style={{
                      fontSize: "15px",
                      color: "#d94673",
                      paddingBottom: "25px",
                    }}
                  >
                    ❤️ 일기 열람 완료
                  </div>
                )}

                {day && groupCount > 0 && (
                  <div
                    style={{
                      marginTop: "4px",
                      display: "flex",
                      gap: "4px",
                      justifyContent: "center",
                    }}
                  >
                    {Array.from({ length: groupCount }).map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor: "#d94673",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
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
const styles = {
  readStatus: {
    position: "absolute",
    bottom: "6px",
    right: "6px",
    backgroundColor: "#f43f5e",
    color: "#fff",
    fontSize: "12px",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
};

export default Calendar;
