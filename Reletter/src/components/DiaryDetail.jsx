import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function DiaryDetail() {
  const { diaryId } = useParams();
  const navigate = useNavigate();
  const [diary, setDiary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiary = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(
          `http://localhost:4000/diaries/${diaryId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDiary(res.data);
      } catch (err) {
        setError("일기 정보를 불러오는데 실패했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiary();
  }, [diaryId]);

  if (loading) return <p>로딩중...</p>;
  if (error) return <p>{error}</p>;
  if (!diary) return <p>일기를 찾을 수 없습니다.</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "20px",
          padding: "8px 12px",
          borderRadius: "8px",
          border: "1px solid #d94673",
          backgroundColor: "#fff0f5",
          color: "#d94673",
          cursor: "pointer",
        }}
      >
        ← 뒤로가기
      </button>

      <h1 style={{ color: "#9d174d", marginBottom: "12px" }}>
        {diary.title || "제목 없음"}
      </h1>

      <p style={{ color: "#666", marginBottom: "24px" }}>
        작성일: {new Date(diary.createdAt).toLocaleString()}
      </p>

      <div
        style={{
          whiteSpace: "pre-wrap",
          fontSize: "16px",
          lineHeight: "1.5",
          color: "#333",
          backgroundColor: "#fff0f5",
          padding: "16px",
          borderRadius: "8px",
          border: "1px solid #f9a8d4",
        }}
      >
        {diary.content || "내용이 없습니다."}
      </div>
    </div>
  );
}

export default DiaryDetail;
