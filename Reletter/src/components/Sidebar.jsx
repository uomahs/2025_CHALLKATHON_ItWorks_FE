import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const [groups, setGroups] = useState([]);
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  const addGroup = () => {
    navigate("/Group"); // ✅ 페이지 이동으로 변경
  };

  const handleFindClick = () => {
    navigate("/findfriend");
  };

  return (
    <aside style={sidebarStyle}>
      <h3 style={sectionTitle}>📂 그룹</h3>
      <div style={sectionListStyle}>
        {groups.length === 0 && (
          <p style={emptyTextStyle}>아직 생성된 그룹이 없습니다.</p>
        )}
        {groups.map((group) => (
          <SidebarItem key={group.id} label={`💌 ${group.name}`} />
        ))}
        <button onClick={addGroup} style={addButtonStyle}>
          + 그룹 추가
        </button>
      </div>
      <h3 style={{ ...sectionTitle, marginTop: "24px" }}>👥 친구 목록</h3>
      <div style={{ ...sectionListStyle, flexGrow: 1 }}>
        {friends.length === 0 && (
          <p style={emptyTextStyle}>아직 추가된 친구가 없습니다.</p>
        )}
        {friends.map((friend) => (
          <SidebarItem key={friend.id} label={`🧑 ${friend.name}`} />
        ))}
        <button onClick={handleFindClick} style={addButtonStyle}>
          + 친구 찾기
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({ label }) {
  return <div style={linkStyle}>{label}</div>;
}

const sidebarStyle = {
  width: "220px",
  backgroundColor: "#fdf2f8",
  padding: "24px 16px",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  boxShadow: "2px 0 6px rgba(0, 0, 0, 0.05)",
};

const sectionTitle = {
  fontSize: "16px",
  color: "#9d174d",
  marginBottom: "12px",
};

const linkStyle = {
  textDecoration: "none",
  color: "#374151",
  fontSize: "15px",
  padding: "8px 12px",
  borderRadius: "8px",
  transition: "background 0.2s",
  cursor: "pointer",
};

const emptyTextStyle = {
  fontSize: "13px",
  color: "#999",
  paddingLeft: "4px",
  marginBottom: "8px",
};

const sectionListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  paddingRight: "4px",
};

const addButtonStyle = {
  marginTop: "8px",
  padding: "6px 10px",
  fontSize: "14px",
  border: "1px solid #f9a8d4",
  borderRadius: "8px",
  backgroundColor: "#ffffff",
  color: "#9d174d",
  cursor: "pointer",
  width: "100%",
};

export default Sidebar;
