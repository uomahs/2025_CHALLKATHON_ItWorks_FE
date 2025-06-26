import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function Calendar() {
  const navigate = useNavigate();
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [unreadSummary, setUnreadSummary] = useState({});
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
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

  const isToday = (day) =>
    year === today.getFullYear() &&
    month === today.getMonth() &&
    day === today.getDate();

  const isSelected = (day) =>
    selectedDate &&
    selectedDate.year === year &&
    selectedDate.month === month &&
    selectedDate.day === day;

  const dates = [];
  for (let i = 0; i < firstDay; i++) dates.push(null);
  for (let i = 1; i <= lastDate; i++) dates.push(i);

  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: "100px" }}>로딩 중...</p>
    );
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
            const daySummary = unreadSummary[formattedDate];
            const unreadCount = daySummary?.unreadCount || 0;
            const readCount = daySummary?.readCount || 0;
            const totalCount = daySummary?.totalCount || 0;

            const isFuture =
              new Date(formattedDate) > new Date().setHours(0, 0, 0, 0);

            return (
              <div
                key={index}
                onClick={() => {
                  if (!day) return;

                  if (totalCount === 0 && isFuture) {
                    alert("작성된 일기가 없습니다.");
                    return;
                  }

                  if (isFuture) {
                    const tomorrow = new Date(formattedDate);
                    tomorrow.setDate(tomorrow.getDate() + 1);

                    const y = tomorrow.getFullYear();
                    const m = String(tomorrow.getMonth() + 1).padStart(2, "0");
                    const d = String(tomorrow.getDate()).padStart(2, "0");

                    alert(`${y}년 ${m}월 ${d}일에 만나요!`);
                    return;
                  }

                  setSelectedDate({ year, month, day });
                  navigate(`/diary/${formattedDate}`);
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  padding: "8px",
                  backgroundColor: isToday(day)
                    ? "#fde8ec"
                    : hoveredIndex === index && day
                    ? "#fde8ec"
                    : "#fff",
                  border: isSelected(day)
                    ? "2px solid #d94673"
                    : hoveredIndex === index && day
                    ? "2px solid #d94673"
                    : "1px solid #eee",
                  borderRadius: "8px",
                  color: day ? "#333" : "transparent",
                  cursor: day ? "pointer" : "default",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transform:
                    hoveredIndex === index && day ? "translateY(-2px)" : "none",
                  boxShadow:
                    hoveredIndex === index && day
                      ? "0 4px 8px rgba(217, 70, 115, 0.1)"
                      : "none",
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                  {day || ""}
                </div>

                {day && totalCount > 0 && (
                  <div style={{ fontSize: "15px", paddingBottom: "25px" }}>
                    {readCount > 0 && !isFuture && (
                      <div style={{ color: "#14b8a6" }}>
                        ❤️ 열람 일기 {readCount}개
                      </div>
                    )}
                    {unreadCount > 0 && (
                      <div style={{ color: isFuture ? "#d94673" : "#d94673" }}>
                        {isFuture
                          ? `⭐️ 곧 만날 일기 ${unreadCount}개`
                          : `💌 미열람 일기 ${unreadCount}개`}
                      </div>
                    )}
                  </div>
                )}

                {day && totalCount === 0 && (
                  <div
                    style={{
                      fontSize: "15px",
                      color: "#9ca3af",
                      paddingBottom: "25px",
                    }}
                  >
                    일기 없음
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

export default Calendar;
