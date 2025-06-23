import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Group() {
  const [groupName, setGroupName] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [isCreated, setIsCreated] = useState(false);
  const navigate = useNavigate();

  // 친구 목록은 추후 백엔드에서 가져올 예정
  // const [friends, setFriends] = useState([]);
  // useEffect(() => {
  //   fetch("http://localhost:4000/users/friends", {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((data) => setFriends(data));
  // }, []);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return alert("그룹 이름을 입력하세요.");
    if (selectedFriends.length === 0) return alert("친구를 선택하세요.");

    try {
      const res = await fetch("http://localhost:4000/users/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ name: groupName }),
      });

      const result = await res.json();
      const groupId = result.groupId;

      await fetch(`http://localhost:4000/users/groups/${groupId}/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ userIds: selectedFriends }),
      });

      setIsCreated(true);
    } catch (err) {
      console.error(err);
      alert("그룹 생성 실패");
    }
  };

  return (
    <div style={{ backgroundColor: "#fff0f6", minHeight: "100vh", padding: "60px 0" }}>
      <div style={styles.container}>
        {isCreated ? (
          <div style={styles.successBox}>
            <h2>🎉 그룹 생성 완료!</h2>
            <button style={styles.button} onClick={() => navigate("/main")}>
              메인으로 이동
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreateGroup}>
            <h2 style={styles.title}>👥 그룹 만들기</h2>

            <label style={styles.label}>
              그룹 이름:
              <input
                type="text"
                placeholder="그룹 이름을 입력하세요"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              친구 선택:
              <div style={styles.checkboxList}>
                {/* 친구 목록은 나중에 백엔드에서 받아와 map으로 렌더링 */}
                {/* 
                {friends.map((friend) => (
                  <label key={friend.id} style={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      value={friend.id}
                      checked={selectedFriends.includes(friend.id)}
                      onChange={() => {
                        setSelectedFriends((prev) =>
                          prev.includes(friend.id)
                            ? prev.filter((id) => id !== friend.id)
                            : [...prev, friend.id]
                        );
                      }}
                    />
                    <img src={friend.profileImage} alt="profile" style={styles.avatar} />
                    <span style={styles.friendName}>{friend.name}</span>
                  </label>
                ))}
                */}
                <p style={{ color: "#888", marginTop: "8px" }}>
                  친구 목록은 추후 표시될 예정입니다.
                </p>
              </div>
            </label>

            <button type="submit" style={styles.button}>
              그룹 생성
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "30px",
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    fontFamily: "'Pretendard', sans-serif",
    textAlign: "left",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#b51b6f",
    textAlign: "center",
  },
  label: {
    display: "block",
    fontWeight: "bold",
    fontSize: "16px",
    color: "#b51b6f",
    marginBottom: "12px",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "10px 14px",
    fontSize: "16px",
    marginTop: "8px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "20px",
    boxSizing: "border-box",
  },
  checkboxList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "10px",
    maxHeight: "200px",          
    overflowY: "auto",    
    paddingRight: "4px",
  },
  
  checkboxItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  friendName: {
    fontSize: "16px",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#e91e63",
    color: "white",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "16px",
  },
  successBox: {
    padding: "20px",
    backgroundColor: "#fff0f6",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
};

export default Group;
