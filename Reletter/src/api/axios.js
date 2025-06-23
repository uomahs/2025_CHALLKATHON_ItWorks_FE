import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api', // 백엔드 주소
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
