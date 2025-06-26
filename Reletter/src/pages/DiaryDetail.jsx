import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import DiaryComments from "../components/DiaryComments";

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
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [diaries, setDiaries] = useState([]);
  const [readCount, setReadCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  const token = localStorage.getItem("accessToken");
  const userEmail = token ? JSON.parse(atob(token.split(".")[1])).email : null;

  // 일기 목록 조회 함수 (재사용 가능하도록 분리)
  const fetchGroupDiaries = async () => {
    try {
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

      const diaries = res.data;
      setDiaries(diaries);

      // 읽음 통계 계산
      const read = diaries.filter((d) => d.readBy?.includes(userEmail)).length;
      const unread = diaries.length - read;
      setReadCount(read);
      setUnreadCount(unread);

      // 자동 읽음 처리
      await Promise.all(
        diaries.map((diary) =>
          axios.post(
            `http://localhost:4000/diaries/${diary._id}/read`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ).catch((err) =>
            console.error(`❌ 일기 ${diary._id} 읽음 처리 실패`, err)
          )
        )
      );

    } catch (err) {
      console.error("❌ 그룹 일기 조회 실패:", err);
      alert("일기를 불러오는 데 실패했습니다.");
    }
  };

  // 검색 파라미터에서 날짜 추출 (초기 세팅)
  useEffect(() => {
    const paramDate = searchParams.get("date");
    if (paramDate) {
      setDate(paramDate);
    } else {
      setDate(getLocalDateString(new Date()));
    }
  }, [searchParams]);

  // 날짜 또는 groupId 변경 시 일기 목록 재조회
  useEffect(() => {
    if (groupId && date) {
      fetchGroupDiaries();
    }
  }, [groupId, date]);

  // 삭제 처리 함수
  const handleDelete = async (diaryId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`http://localhost:4000/diaries/${diaryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("삭제 완료!");
      // 삭제 후 최신 목록 재조회
      await fetchGroupDiaries();
    } catch (err) {
      console.error("❌ 삭제 실패", err);
      alert("삭제 중 오류 발생");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#fff0f6",
        paddingBottom: "100%",
      }}
    >
      <div>
        <Header />
      </div>

      <div style={styles.wrapper}>
        <h1 style={styles.pageTitle}>📘 {formatDate(date)} </h1>

        <p style={styles.summary}>
          👀 열람 일기 {readCount}개&nbsp;&nbsp;&nbsp;
          💌 미열람 일기 {unreadCount}개
        </p>

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

              {diary.user?.email === userEmail && (
                <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                  <button
                    onClick={() => navigate(`/diary/edit/${diary._id}`)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#fcd34d",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    ✏️ 수정
                  </button>

                  <button
                    onClick={() => handleDelete(diary._id)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#f87171",
                      border: "none",
                      borderRadius: "6px",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    🗑 삭제
                  </button>
                </div>
              )}

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
    marginBottom: 12,
  },
  summary: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 28,
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
