import React from "react";
import { useNavigate } from "react-router-dom";

const Write = () => {
  const navigate = useNavigate();

  const handleBtnClick = () => {
    navigate("/newdiary");
  };

  return (
    <button
      onClick={handleBtnClick}
      style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        padding: "16px 24px",
        backgroundColor: "#ec4899",
        color: "white",
        fontSize: "16px",
        borderRadius: "9999px",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
        zIndex: 999,
      }}
    >
      ✍️ 새 글 쓰기
    </button>
  );
};

export default Write;
