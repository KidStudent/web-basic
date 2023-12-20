import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import viteCompression from 'vite-plugin-compression';
import DefineOptions from 'unplugin-vue-define-options/vite';
import legacy from '@vitejs/plugin-legacy';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
export function getPluginsList() {
  return [
    vue(),
    // jsx、tsx语法支持
    vueJsx(),
    DefineOptions(),
    viteCompression(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
    AutoImport({
      dts: false,
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      // 指定组件所在文件夹的位置，默认是src/components
      dirs: [],
      dts: false,
      resolvers: [ElementPlusResolver()],
    }),
  ];
}
