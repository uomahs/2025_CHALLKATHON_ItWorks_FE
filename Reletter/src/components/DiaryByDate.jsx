import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const DiaryByDate = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const [groupPreviews, setGroupPreviews] = useState([]);

  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [pendingGroupId, setPendingGroupId] = useState(null);

  const parseDateToLocal = (dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day, 0, 0, 0, 0);
  };

  const isFutureOrTodayDate = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = parseDateToLocal(dateStr);
    return target >= today;
  };

  const nextDate = (dateStr) => {
    const d = parseDateToLocal(dateStr);
    d.setDate(d.getDate() + 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${year}년 ${month}월 ${day}일`;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isFutureOrTodayDate(date)) {
        setGroupPreviews([]);
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          alert("로그인이 필요합니다.");
          return;
        }

        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}
/diaries/date/${date}`,
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
                `${process.env.REACT_APP_API_URL}
/diaries/${diary.id}/read`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

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

        setGroupPreviews(updatedGroups.filter(Boolean));
      } catch (err) {
        console.error("❌ 일기 조회 실패:", err);
        alert("작성된 일기가 없습니다.");
      }
    };

    fetchData();
  }, [date]);

  const handleFutureClick = () => {
    const nextDay = nextDate(date);
    alert(`${formatDate(nextDay)}에 만나요!`);
    navigate("/main");
  };

  return (
    <div
      style={{
        backgroundColor: "#fff0f6",
        paddingBottom: "500px",
        marginTop: "-40px",
      }}
    >
      <h2 style={styles.dateTitle}>❤️ {formatDate(date)} ❤️</h2>
      <div style={styles.container}>
        {isFutureOrTodayDate(date) ? (
          <div style={styles.futureBox} onClick={handleFutureClick}>
            <p style={styles.futureText}>
              📅 {formatDate(nextDate(date))}에 만나요!
            </p>
          </div>
        ) : groupPreviews.length === 0 ? (
          <p style={{ textAlign: "center", color: "#777", width: "100%" }}>
            작성된 일기가 없습니다.
          </p>
        ) : (
          groupPreviews.map((group) => {
            const diary = group.entries[0];
            if (!diary) return null;

            const imageSrc = diary.imageUrl
              ? diary.imageUrl.startsWith("http")
                ? `${diary.imageUrl}?t=${new Date().getTime()}`
                : `${process.env.REACT_APP_API_URL}
                ${diary.imageUrl}`
              : "/close.png";

            const groupId = group.id || group._id;

            return (
              <div
                key={groupId}
                style={styles.groupBox}
                onClick={() => {
                  if (!group.hasPassword) {
                    navigate(`/diary/group/${groupId}?date=${date}`);
                  } else {
                    setPendingGroupId(groupId);
                    setShowPasswordPrompt(true);
                  }
                }}
              >
                <h3 style={styles.groupTitle}>{group.groupName}</h3>

                <img
                  src={imageSrc}
                  alt="preview"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/close.png";
                  }}
                  style={styles.image}
                />

                <p style={styles.title}>{diary.previewText}</p>
                <p style={styles.readBy}>
                  일기를 펼쳐본 사람 👀 : <br />
                  {diary.readBy?.length > 0
                    ? diary.readBy.join(", ")
                    : "아직 없음"}
                </p>
              </div>
            );
          })
        )}
      </div>

      {showPasswordPrompt && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fde8ec",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
            zIndex: 1000,
            width: "300px",
          }}
        >
          <h3>비밀번호 입력</h3>
          <input
            type="password"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            placeholder="그룹 비밀번호"
            style={{ padding: "8px", marginBottom: "12px", width: "100%", boxSizing: "border-box" }}
          />
          <div sytle ={{display: "flex", justifyContent : "flex-end", gap : "8px", marginTop: "12px"}}>
            <button
              onClick={async () => {
                try {
                  const token = localStorage.getItem("accessToken");
                  await axios.post(
                    `${process.env.REACT_APP_API_URL}
/users/groups/${pendingGroupId}/verify-password`,
                    { password: inputPassword },
                    { headers: { Authorization: `Bearer ${token}` } }
                  );

                  setShowPasswordPrompt(false);
                  setInputPassword("");
                  navigate(`/diary/group/${pendingGroupId}?date=${date}`);
                } catch (err) {
                  alert("❌ 비밀번호가 틀렸습니다.");
                  console.error(err);
                }
              }}
            
              style={buttonStyle}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#fff")}

            >
              확인
            </button>
            <button
              onClick={() => {
                setShowPasswordPrompt(false);
                setInputPassword("");
                setPendingGroupId(null);
              }}

              style={buttonStyle}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#fff")}

            >
              취소
            </button>
          </div>
        </div>
      )}
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
    width: "500px",
    height: "auto",
  },
  image: {
    width: "100%",
    height: "auto",
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
    textAlign: "center",
  },
  futureBox: {
    backgroundColor: "#fff0f6",
    paddingBottom: "132px",
    marginTop: "50px",
    paddingTop: "100px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
    cursor: "pointer",
    width: "500px",
  },
  futureText: {
    fontSize: "22px",
    color: "#d94673",
    fontWeight: "bold",
  },
};

const buttonStyle = {
  padding: "8px 16px",
  backgroundColor: "#fff",
  border: "2px solid #d94673",
  color: "#d94673",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "14px",
  transition: "background-color 0.2s ease",
};



export default DiaryByDate;
