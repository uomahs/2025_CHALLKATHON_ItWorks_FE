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

  const isFutureDate = (dateStr) => {
    const today = new Date();
    const target = new Date(dateStr);
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    return target > today;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isFutureDate(date)) return;

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

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${year}년 ${month}월 ${day}일`;
  };

  const handleFutureClick = () => {
    alert(`${formatDate(date)}에 만나요!`);
    navigate("/");
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
        {isFutureDate(date) ? (
          <div style={styles.futureBox} onClick={handleFutureClick}>
            <p style={styles.futureText}>📅 {formatDate(date)}에 만나요!</p>
          </div>
        ) : (
          groupPreviews.map((group) => {
            const diary = group.entries[0];
            if (!diary) return null;

            const imageSrc = diary.imageUrl
              ? diary.imageUrl.startsWith("http")
                ? `${diary.imageUrl}?t=${new Date().getTime()}`
                : `http://localhost:4000${diary.imageUrl}`
              : "/close.png";

            const groupId = group.id || group._id;

            return (
              <div
                key={groupId}
                style={styles.groupBox}
                onClick={() => {
                  // 인증된 그룹이라면 바로 이동
                  if (localStorage.getItem(`verifiedGroup_${groupId}`) === "true") {
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
                  일기를 펼쳐본 사람 👀 :{" "}
                  {diary.readBy?.length > 0
                    ? diary.readBy.join(", ")
                    : "아직 없음"}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* ✅ 비밀번호 입력창 모달 */}
      {showPasswordPrompt && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
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
            style={{ padding: "8px", marginBottom: "12px", width: "100%" }}
          />
          <div>
            <button
              onClick={async () => {
                try {
                  const token = localStorage.getItem("accessToken");
                  await axios.post(
                    `http://localhost:4000/users/groups/${pendingGroupId}/verify-password`,
                    { password: inputPassword },
                    { headers: { Authorization: `Bearer ${token}` } }
                  );

                  localStorage.setItem(`verifiedGroup_${pendingGroupId}`, "true");
                  setShowPasswordPrompt(false);
                  setInputPassword("");
                  navigate(`/diary/group/${pendingGroupId}?date=${date}`);
                } catch (err) {
                  alert("❌ 비밀번호가 틀렸습니다.");
                  console.error(err);
                }
              }}
              style={{ marginRight: "8px" }}
            >
              확인
            </button>
            <button
              onClick={() => {
                setShowPasswordPrompt(false);
                setInputPassword("");
                setPendingGroupId(null);
              }}
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
  },
  futureBox: {
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

export default DiaryByDate;
