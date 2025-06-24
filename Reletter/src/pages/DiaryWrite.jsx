import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DiaryWrite = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [group, setGroup] = useState("");
  const [image, setImage] = useState(null); // 사진 상태
  const [previewUrl, setPreviewUrl] = useState(null); // 미리보기

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("날짜:", date);
    console.log("선택된 그룹:", group);
  };

  const handleReturnClick = () => {
    navigate("/main");
  };

  useEffect(() => {
    fetch("http://localhost:4000/diaries/status")
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch((err) => console.error("상태 불러오기 오류:", err));
  }, []);

  useEffect(() => {
    const autoSave = setInterval(() => {
      fetch("http://localhost:4000/diaries/auto-save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
    }, 10000);
    return () => clearInterval(autoSave);
  }, [title, content]);

  const handleCreate = async () => {
    try {
      const res = await fetch("http://localhost:4000/diaries/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      await res.json();
      alert("일기 생성 완료!");
      navigate("/main");
    } catch (err) {
      console.error("생성 오류:", err);
      alert("생성 실패");
    }
  };

  const handleTempSave = async () => {
    try {
      await fetch("http://localhost:4000/diaries/temp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      alert("임시 저장 완료");
    } catch (err) {
      console.error("임시 저장 오류:", err);
      alert("임시 저장 실패");
    }
  };

  return (
    <div style={styles.page}>
      <button onClick={handleReturnClick} style={styles.returnBtn}>
        ⬅️ 메인화면으로
      </button>

      <div style={styles.mainContainer}>
        <div style={styles.leftPanel}>
          <h3 style={styles.title}>📷 사진 추가</h3>
          <label htmlFor="imageUpload" style={styles.imageUploadLabel}>
            사진 선택
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }} // 숨김 처리
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="preview"
              style={{ marginTop: "1rem", width: "100%", borderRadius: "12px" }}
            />
          )}
        </div>

        <div style={styles.container}>
          <h2 style={styles.title}>📓 일기 작성</h2>

          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>
              날짜 선택:
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              그룹 선택:
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                required
                style={styles.input}
              >
                <option value="">그룹을 선택하세요</option>
                {/* 백엔드에서 받아올 예정 */}
              </select>
            </label>
          </form>

          <div style={styles.status}>
            작성 상태: <strong>{status || "불러오는 중..."}</strong>
          </div>

          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />

          <textarea
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={styles.textarea}
          />

          <div style={styles.buttonGroup}>
            <button onClick={handleTempSave} style={styles.button}>
              임시 저장
            </button>
            <button onClick={handleCreate} style={styles.endBtn}>
              작성 완료 💌
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: "#fff0f6",
    height: "745px",
    padding: "2rem",
  },
  mainContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "2rem",
  },
  leftPanel: {
    width: "300px",
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "16px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
    height: "fit-content",
  },
  subtitle: {
    color: "#9d174d",
    marginBottom: "1rem",
    fontWeight: "bold",
    fontSize: "20px",
  },
  container: {
    width: "600px",
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "16px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
  },
  title: {
    color: "#9d174d",
    marginBottom: "1.5rem",
    fontSize: "28px",
    fontWeight: "bold",
  },
  imageUploadLabel: {
    display: "inline-block",
    padding: "10px 16px",
    backgroundColor: "#ec4899",
    color: "white",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    marginTop: "8px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginBottom: "1rem",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    fontWeight: "bold",
    color: "#9d174d",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    marginTop: "6px",
  },
  textarea: {
    width: "100%",
    height: "230px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    resize: "none",
    marginTop: "1rem",
    padding: "12px 12px 0 12px",
    boxSizing: "border-box",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
    marginTop: "1.5rem",
    justifyContent: "center",
  },
  button: {
    padding: "10px 16px",
    borderRadius: "20px",
    border: "none",
    backgroundColor: "#ec4899",
    color: "white",
    fontWeight: "bold",
    fontSize: "14px",
    cursor: "pointer",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
  },
  returnBtn: {
    position: "fixed",
    top: "30px",
    left: "30px",
    padding: "16px 24px",
    backgroundColor: "white",
    color: "#9d174d",
    fontSize: "16px",
    borderRadius: "9999px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
  },
  endBtn: {
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
  },
  status: {
    color: "#6b7280",
    marginTop: "1rem",
    marginBottom: "1rem",
  },
};

export default DiaryWrite;
