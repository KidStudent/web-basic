import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import { getPluginsList } from './build/plugins';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [getPluginsList()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    define: {
      'process.env': env,
    },
    terserOptions: {
      compress: {
        // warnings: false,
        // drop_console: true,  //打包时删除console
        drop_debugger: true, //打包时删除 debugger
        // pure_funcs: ['console.log'],
      },
      output: {
        // 去掉注释内容
        comments: true,
      },
    },
    server: {
      open: '/index.html',
      port: 8888,
      proxy: {
        '/json': {
          target: `http://192.168.1.121`,
          changeOrigin: true,
        },
        '/temp': {
          target: `http://192.168.1.121`,
          changeOrigin: true,
        },
        '/qsdi': {
          target: `http://192.168.1.121:8888`,
          changeOrigin: true,
        },
        '/ivdg': {
          target: `http://192.168.1.121:8888`,
          changeOrigin: true,
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import '@/style/handle.scss';`,
        },
      },
    },
  };
});
