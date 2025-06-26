import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    ...(mode === 'development' && {
      server: {
        proxy: {
          '/api': {
            target: 'http://localhost:4000', // ✅ 실제 개발 서버 주소
            changeOrigin: true,
            rewrite: path => path.replace(/^\/api/, ''),
          },
        },
      },
    }),
  };
});
