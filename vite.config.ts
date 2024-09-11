import path from 'path';
import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default function (): UserConfig {
  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  });
}
