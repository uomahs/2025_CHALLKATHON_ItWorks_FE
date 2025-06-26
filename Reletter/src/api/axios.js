import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // ✅ 환경변수로 백엔드 주소 설정
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 백엔드에서 쿠키 인증 쓰면 유지 (필요 없으면 제거해도 됨)
});

export default api;
