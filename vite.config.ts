import path from 'path';
import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default function (): UserConfig {
  return defineConfig({
    server: {
      proxy: {
        '^/s3admin/*': {
          target: 'https://s3admin.buntubox.xyz/v1',
          rewrite(path) {
            return path.replace(/^\/s3admin/, '');
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
  });
}
