import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";

const DiaryEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [groupId, setGroupId] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);

  // 기존 일기 데이터 불러오기
  useEffect(() => {
    const fetchDiary = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(`http://localhost:4000/diaries/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTitle(res.data.title || "");
        setContent(res.data.content || "");
        setGroupId(res.data.group?._id || "");
        setDate(res.data.date || "");
        setLoading(false);
      } catch (error) {
        alert("일기 데이터를 불러오는 데 실패했습니다.");
        navigate(-1);
      }
    };
    fetchDiary();
  }, [id, navigate]);

  // 수정 저장 핸들러
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(
        `http://localhost:4000/diaries/${id}`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("수정이 완료되었습니다.");

      // 수정 후 그룹별 날짜별 상세 페이지로 이동 (query string에 날짜 포함)
      navigate(`/diary/group/${groupId}?date=${date}`);
    } catch (error) {
      alert("수정 실패: " + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: 40 }}>로딩 중...</p>;

  return (
    <div style={{ backgroundColor: "#fff0f6", minHeight: "100vh", paddingBottom: "100px" }}>
      <Header />

      <div style={styles.wrapper}>
        <h1 style={styles.pageTitle}>✏️ 일기 수정하기</h1>

        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.inputTitle}
        />

        <textarea
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={styles.textareaContent}
        />

        <button onClick={handleSave} style={styles.saveButton}>
          저장하기
        </button>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    maxWidth: 800,
    margin: "40px auto",
    padding: "0 20px",
  },
  pageTitle: {
    fontSize: 28,
    textAlign: "center",
    color: "#d94673",
    marginBottom: 20,
  },
  inputTitle: {
    width: "100%",
    fontSize: 20,
    padding: "10px 15px",
    borderRadius: 12,
    border: "1.5px solid #d1d5db",
    marginBottom: 20,
    outline: "none",
  },
  textareaContent: {
    width: "100%",
    height: 250,
    fontSize: 16,
    padding: 15,
    borderRadius: 12,
    border: "1.5px solid #d1d5db",
    resize: "vertical",
    outline: "none",
    whiteSpace: "pre-wrap",
  },
  saveButton: {
    marginTop: 24,
    width: "100%",
    backgroundColor: "#d94673",
    color: "white",
    fontSize: 18,
    padding: "12px 0",
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
  },
};

export default DiaryEdit;
