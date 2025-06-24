import React from "react";
import { useParams } from "react-router-dom";

const DiaryByDate = () => {
  const { date } = useParams();

  return (
    <div>
      <h2>{date}의 일기 목록</h2>
      {/* 그룹별 미리보기는 나중에 추가 */}
    </div>
  );
};

export default DiaryByDate;
