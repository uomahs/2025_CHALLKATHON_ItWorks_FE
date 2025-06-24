import React, { useState } from "react";
import GroupForm from "../components/GroupForm";
import Header from "../components/Header"; // 네가 만든 헤더 컴포넌트

function GroupPage() {
  const [isCreated, setIsCreated] = useState(false);

  return (
    <div style={{ backgroundColor: "#fff0f6", minHeight: "100vh" }}>
      <Header />
      <main style={{ padding: "60px 20px" }}>
        {isCreated ? (
          <div style={{ textAlign: "center" }}>
            <h2>🎉 그룹이 성공적으로 생성되었습니다!</h2>
          </div>
        ) : (
          <GroupForm onCreated={() => setIsCreated(true)} />
        )}
      </main>
    </div>
  );
}

export default GroupPage;
