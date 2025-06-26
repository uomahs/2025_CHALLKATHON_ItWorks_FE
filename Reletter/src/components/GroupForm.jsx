import React, { useState, useEffect } from "react";

function GroupForm({ onCreated }) {
  const [groupName, setGroupName] = useState("");
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [myGroups, setMyGroups] = useState([]); // ✅ 내 그룹 목록

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        // 친구 목록
        const friendRes = await fetch(
          "${process.env.REACT_APP_API_URL}/users/friends/list",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!friendRes.ok) throw new Error("친구 목록 불러오기 실패");
        const friendsData = await friendRes.json();
        setFriends(friendsData);

        // 받은 초대 목록
        const inviteRes = await fetch(
          "${process.env.REACT_APP_API_URL}/users/groups/invitations",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!inviteRes.ok) throw new Error("초대 목록 불러오기 실패");
        const invitesData = await inviteRes.json();
        setInvitations(invitesData);

        // 내가 속한 그룹 목록 ✅
        const groupRes = await fetch(
          "${process.env.REACT_APP_API_URL}/users/groups/list",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!groupRes.ok) throw new Error("그룹 목록 불러오기 실패");
        const groupData = await groupRes.json();
        setMyGroups(groupData);
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
      }
    };

    fetchData();
  }, []);

  const toggleFriend = (email) => {
    setSelectedFriends((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const acceptInvite = async (groupId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/users/groups/${groupId}/accept`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("초대 수락 실패");
      alert("초대를 수락했습니다.");
      setInvitations((prev) => prev.filter((inv) => inv.groupId !== groupId));
    } catch (err) {
      console.error(err);
      alert("초대 수락 중 오류가 발생했습니다.");
    }
  };

  const rejectInvite = async (groupId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/users/groups/${groupId}/reject`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("초대 거절 실패");
      alert("초대를 거절했습니다.");
      setInvitations((prev) => prev.filter((inv) => inv.groupId !== groupId));
    } catch (err) {
      console.error(err);
      alert("초대 거절 중 오류가 발생했습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return alert("그룹 이름을 입력하세요.");
    if (selectedFriends.length === 0) return alert("친구를 선택하세요.");

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("${process.env.REACT_APP_API_URL}/users/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: groupName }),
      });

      if (!res.ok) throw new Error("그룹 생성 실패");

      const result = await res.json();
      const groupId = result.groupId;

      const inviteRes = await fetch(
        `${process.env.REACT_APP_API_URL}/users/groups/${groupId}/invite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userEmails: selectedFriends }),
        }
      );

      if (!inviteRes.ok) throw new Error("친구 초대 실패");

      alert("그룹이 생성되었습니다!");
      setGroupName("");
      setSelectedFriends([]);
      onCreated();
    } catch (err) {
      console.error(err);
      alert("그룹 생성 실패");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
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
              <p style={styles.noFriends}>친구가 없습니다.</p>
            ) : (
              friends.map((friend) => (
                <div key={friend.email} style={{ marginBottom: "6px" }}>
                  <label style={{ fontWeight: "normal" }}>
                    <input
                      type="checkbox"
                      checked={selectedFriends.includes(friend.email)}
                      onChange={() => toggleFriend(friend.email)}
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

      <div>
        <h2 style={styles.group}>📂 내 그룹 목록</h2>
        {myGroups.length === 0 ? (
          <p style={styles.noInvites}>속한 그룹이 없습니다.</p>
        ) : (
          myGroups.map((group) => (
            <div
              key={group._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "10px",
                backgroundColor: "#fefefe",
              }}
            >
              <p>그룹명: <strong>{group.name}</strong></p>
              <p>리더: {group.leader?.name || "알 수 없음"}</p>
            </div>
          ))
        )}
      </div>

      <div>
        <h2 style={styles.group}>📨 받은 그룹 초대</h2>
        {invitations.length === 0 ? (
          <p style={styles.noInvites}>받은 초대가 없습니다.</p>
        ) : (
          invitations.map((invite) => (
            <div
              key={invite.groupId}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "10px",
                backgroundColor: "#fff",
              }}
            >
              <p>
                그룹명: <strong>{invite.groupName}</strong>
              </p>
              <p>초대한 사람: {invite.inviterName}</p>
              <button
                style={{ ...styles.smallButton, backgroundColor: "#4caf50" }}
                onClick={() => acceptInvite(invite.groupId)}
              >
                수락
              </button>
              <button
                style={{ ...styles.smallButton, backgroundColor: "#f44336" }}
                onClick={() => rejectInvite(invite.groupId)}
              >
                거절
              </button>
            </div>
          ))
        )}
      </div>
    </div>
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
  group: {
    fontSize: "24px",
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
  noFriends: {
    fontSize: "16px",
    color: "#888",
    margin: 0,
    height: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  noInvites: {
    fontSize: "16px",
    color: "#888",
    margin: 0,
    height: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
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
  },
  smallButton: {
    padding: "6px 12px",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "8px",
  },
};

export default GroupForm;