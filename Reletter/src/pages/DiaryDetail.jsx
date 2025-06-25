import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const DiaryDetail = () => {
  const { id } = useParams(); // 이건 group ID
  const [diaries, setDiaries] = useState([]);

  useEffect(() => {
    const fetchGroupDiaries = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          alert("로그인이 필요합니다.");
          return;
        }

        const res = await axios.get(
          `http://localhost:4000/diaries/group/${id}`,
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

    fetchGroupDiaries();
  }, [id]);

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.pageTitle}>📘 그룹 일기 목록</h1>

      {diaries.length === 0 ? (
        <p style={styles.emptyMessage}>작성된 일기가 없습니다.</p>
      ) : (
        diaries.map((diary) => (
          <div key={diary._id} style={styles.diaryBox}>
            <h2 style={styles.title}>{diary.title}</h2>
            <p style={styles.meta}>
              {diary.date?.slice(0, 10)} | {diary.user?.name || "작성자 없음"}
            </p>
            <p style={styles.content}>{diary.content}</p>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "0 20px",
    backgroundColor: "#fffdfc",
  },
  pageTitle: {
    fontSize: "28px",
    textAlign: "center",
    color: "#d94673",
    marginBottom: "30px",
  },
  emptyMessage: {
    textAlign: "center",
    color: "#777",
  },
  diaryBox: {
    marginBottom: "32px",
    padding: "24px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "8px",
  },
  meta: {
    fontSize: "14px",
    color: "#888",
    marginBottom: "12px",
  },
  content: {
    fontSize: "16px",
    whiteSpace: "pre-wrap",
    color: "#444",
  },
};

export default DiaryDetail;
