import path from 'path';
import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { configDotenv } from 'dotenv';

configDotenv();

export default function (): UserConfig {
  return defineConfig({
    server: {
      proxy: {
        '^/s3-admin-api-proxy/*': {
          target: process.env.DEV_PROXY_URL,
          rewrite(path) {
            return path.replace(/^\/s3-admin-api-proxy/, '');
          },
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    preview: {
      port: 4173,
      strictPort: true,
    },
  });
}
