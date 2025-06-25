import { useEffect, useState } from "react";
import axios from "axios";

const DiaryComments = ({ diaryId }) => {
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");

  // fetchComments 함수는 한 번만 정의
  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(
        `http://localhost:4000/diaries/${diaryId}/comments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("댓글 응답:", res.data);  // 디버깅용
      setComments(res.data);
    } catch (err) {
      console.error("댓글 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [diaryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        `http://localhost:4000/diaries/${diaryId}/comments`,
        { content: commentInput.trim() },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCommentInput("");
      fetchComments(); // 등록 후 댓글 다시 불러오기
    } catch (err) {
      console.error("댓글 등록 실패:", err);
    }
  };

  return (
    <div style={{ marginTop: "16px" }}>
      <h4 style={{ marginBottom: "8px", color: "#d94673" }}>💬 댓글</h4>
      {comments.length === 0 ? (
        <p style={{ color: "#aaa", fontSize: "14px" }}>아직 댓글이 없습니다.</p>
      ) : (
        comments.map((c, idx) => (
          <div key={idx} style={{ marginBottom: "8px" }}>
            <strong>{c.author?.name || "익명"}</strong>: {c.content}
            <div style={{ fontSize: "12px", color: "#999" }}>
              {new Date(c.createdAt).toLocaleString("ko-KR")}
            </div>
          </div>
        ))
      )}

      <form onSubmit={handleSubmit} style={{ marginTop: "8px" }}>
        <input
          type="text"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          placeholder="댓글을 입력하세요"
          style={{ width: "80%", padding: "6px", marginRight: "4px" }}
        />
        <button type="submit" style={{ padding: "6px 12px" }}>
          등록
        </button>
      </form>
    </div>
  );
};

export default DiaryComments;
