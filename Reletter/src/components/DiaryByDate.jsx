import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const DiaryByDate = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const [groupPreviews, setGroupPreviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          alert("로그인이 필요합니다.");
          return;
        }

        const res = await axios.get(
          `http://localhost:4000/diaries/date/${date}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const groups = res.data;

        const updatedGroups = await Promise.all(
          groups.map(async (group) => {
            const diary = group.entries?.[0];
            if (!diary) return null;

            try {
              const readRes = await axios.get(
                `http://localhost:4000/diaries/${diary.id}/read`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              console.log("diary.imageUrl:", diary.imageUrl);

              return {
                ...group,
                entries: [
                  {
                    ...diary,
                    readBy: readRes.data.readBy,
                  },
                ],
              };
            } catch (err) {
              console.error("❌ 읽기 정보 불러오기 실패", err);
              return group;
            }
          })
        );

        setGroupPreviews(updatedGroups);
      } catch (err) {
        console.error("❌ 일기 조회 실패:", err);
        alert("작성된 일기가 없습니다.");
      }
    };

    fetchData();
  }, [date]);

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${year}년 ${month}월 ${day}일`;
  };

  return (
    <div
      style={{
        backgroundColor: "#fff0f6",
        paddingBottom: "132px",
        marginTop: "-40px",
      }}
    >
      <h2 style={styles.dateTitle}>❤️ {formatDate(date)} ❤️</h2>
      <div style={styles.container}>
        {groupPreviews.map((group) => {
          const diary = group.entries[0];
          if (!diary) return null; // diary가 없으면 렌더링하지 않음

          return (
            <div
              key={group.id}
              style={styles.groupBox}
              onClick={() => navigate(`/diary/detail/${diary.id}`)}
            >
              <h3 style={styles.groupTitle}>{group.groupName}</h3>

              <img
                src={
                  diary.imageUrl
                    ? `${diary.imageUrl}?t=${new Date().getTime()}`
                    : "/close.png"
                }
                alt="preview"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/close.png";
                }}
                style={styles.image}
              />

              <p style={styles.title}>{diary.previewText}</p>
              <p style={styles.readBy}>
                일기를 펼쳐본 사람 👀 :{" "}
                {diary.readBy && diary.readBy.length > 0
                  ? diary.readBy.join(", ")
                  : "아직 없음"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "2000px",
    margin: "40px auto",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
    padding: "0 16px",
  },
  groupBox: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    transition: "transform 0.2s",
    width: "280px",
    minHeight: "360px",
  },
  image: {
    width: "100%",
    objectFit: "cover",
    borderRadius: "12px",
    marginBottom: "12px",
  },
  dateTitle: {
    marginTop: "40px",
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#d94673",
    textAlign: "center",
  },

  groupTitle: {
    fontSize: "30px",
    fontWeight: "bold",
    color: "#d94673",
    marginBottom: "16px",
  },
  title: {
    fontSize: "20px",
    color: "#333333",
    marginBottom: "8px",
  },
  readBy: {
    fontSize: "16px",
    color: "#6b7280",
  },
};

export default DiaryByDate;
