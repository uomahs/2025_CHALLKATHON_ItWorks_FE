import React, { useState, useEffect } from "react";

function GroupForm({ onCreated }) {
  const [groupName, setGroupName] = useState("");
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);

  // 친구 목록 불러오기
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch("http://localhost:4000/users/friends", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const data = await res.json();
        setFriends(data);
      } catch (err) {
        console.error("친구 목록 불러오기 실패:", err);
      }
    };
    fetchFriends();
  }, []);

  const toggleFriend = (friendId) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleSubmit = async (e) => {
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

      alert("그룹이 생성되었습니다!");
      onCreated(); // 부모 컴포넌트에 알림
    } catch (err) {
      console.error(err);
      alert("그룹 생성 실패");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.container}>
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
        <div style={styles.friendList}>
          {friends.length === 0 ? (
            <p style={{ fontSize: "16px",
              color: "#888",
               margin: 0,
               height: "50px",
               display: "flex",
               justifyContent: "center",
               alignItems: "center",
               textAlign: "center",}}>친구가 없습니다.</p>
          ) : (
            friends.map((friend) => (
              <div key={friend._id} style={{ marginBottom: "6px" }}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedFriends.includes(friend._id)}
                    onChange={() => toggleFriend(friend._id)}
                    style={{ marginRight: "8px" }}
                  />
                  {friend.name} ({friend.email})
                </label>
              </div>
            ))
          )}
        </div>
      </label>

      <button type="submit" style={styles.button}>
        그룹 생성
      </button>
    </form>
  );
}

const styles = {
  container: {
    backgroundColor: "#fff",
    maxWidth: "500px",
    margin: "0 auto",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "26px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#b51b6f",
    textAlign: "center",
  },
  label: {
    display: "block",
    fontWeight: "bold",
    color: "#b51b6f",
    marginBottom: "12px",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    fontSize: "16px",
    marginTop: "8px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "20px",
    boxSizing: "border-box",
  },
  friendList: {
    maxHeight: "200px",
    overflowY: "auto",
    paddingLeft: "10px",
    marginTop: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "10px",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#d4376e",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "20px",
  },
};

export default GroupForm;
