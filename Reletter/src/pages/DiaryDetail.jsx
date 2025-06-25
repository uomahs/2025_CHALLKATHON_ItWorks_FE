import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import DiaryComments from "../components/DiaryComments"; // 댓글 컴포넌트 import

const getLocalDateString = (dateObj) => {
  const offset = dateObj.getTimezoneOffset();
  const localDate = new Date(dateObj.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 10);
};

const formatDate = (dateStr) => {
  const [year, month, day] = dateStr.split("-");
  return `${year}년 ${month}월 ${day}일`;
};

const DiaryDetail = () => {
  const { groupId } = useParams();
  const [searchParams] = useSearchParams();

  const [date, setDate] = useState(""); // 선택된 날짜 상태
  const [diaries, setDiaries] = useState([]);

  useEffect(() => {
    const paramDate = searchParams.get("date");
    if (paramDate) {
      setDate(paramDate);
    } else {
      const today = getLocalDateString(new Date());
      setDate(today);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchGroupDiaries = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          alert("로그인이 필요합니다.");
          return;
        }

        const res = await axios.get(
          `http://localhost:4000/diaries/group/${groupId}?date=${date}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDiaries(res.data);
      } catch (err) {
        console.error("❌ 그룹 일기 조회 실패:", err);
        alert("일기를 불러오는 데 실패했습니다.");
      }
    };

    if (groupId && date) {
      fetchGroupDiaries();
    }
  }, [groupId, date]);

  return (
    <div
      style={{
        backgroundColor: "#fff0f6",
        paddingBottom: "100%",
      }}
    >
      {/* Header는 div로 감싸 유지 */}
      <div>
        <Header />
      </div>

      <div style={styles.wrapper}>
        <h1 style={styles.pageTitle}>📘 {formatDate(date)} </h1>

        {diaries.length === 0 ? (
          <p style={styles.emptyMessage}>작성된 일기가 없습니다.</p>
        ) : (
          diaries.map((diary) => (
            <div key={diary._id} style={styles.diaryBox}>
              <h2 style={styles.title}>{diary.title}</h2>
              <p style={styles.meta}>
                {diary.date?.slice(0, 10)} | {diary.user?.name || "작성자 없음"}
              </p>

              {diary.imageUrl && (
                <img
                  src={`http://localhost:4000${diary.imageUrl}`}
                  alt="diary-img"
                  style={styles.image}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/close.png";
                  }}
                />
              )}

              <p style={styles.content}>{diary.content}</p>

              {/* 댓글 컴포넌트 */}
              <DiaryComments diaryId={diary._id} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    maxWidth: 800,
    margin: "40px auto",
    padding: "0 20px",
  },
  pageTitle: {
    fontSize: 28,
    textAlign: "center",
    color: "#d94673",
    marginBottom: 30,
  },
  emptyMessage: {
    textAlign: "center",
    color: "#777",
  },
  diaryBox: {
    marginBottom: 32,
    padding: 24,
    backgroundColor: "#fffdfc",
    borderRadius: 16,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  meta: {
    fontSize: 14,
    color: "#888",
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: "auto",
    objectFit: "cover",
    borderRadius: 12,
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    whiteSpace: "pre-wrap",
    color: "#444",
  },
};

export default DiaryDetail;
