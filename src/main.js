import { createApp } from 'vue';
import App from './App.vue';
import 'view-ui-plus/dist/styles/viewuiplus.css';
import ViewUIPlus from 'view-ui-plus';
import { Message } from 'view-ui-plus';
import { setupStore, initAppConfigStore } from '@/stores';
import { router, setupRouter } from '@/router';
import { setupRouterGuard } from '@/router/guard';
import { registerGlobComp } from '@/components/registerGlobComp';
import { setupGlobDirectives } from '@/directives';
import axios from '@/config/http/http';
import './style/index.scss';
import 'amfe-flexible';
import ui from '@web-basic-doc/components';
import { UiConfirm } from '@web-basic-doc/components';
import '@web-basic-doc/components/dist/style.css';

async function bootstrap() {
  const app = createApp(App);
  // Configure store
  // 配置 store
  setupStore(app);

  // Initialize internal system configuration
  // 初始化内部系统配置
  await initAppConfigStore();

  // Register global components
  // 注册全局组件
  registerGlobComp(app);

  // Multilingual configuration
  // 多语言配置
  // Asynchronous case: language files may be obtained from the server side
  // 异步案例：语言文件可能从服务器端获取
  // await setupI18n(app);

  // Configure routing
  // 配置路由
  setupRouter(app);

  // router-guard
  // 路由守卫
  setupRouterGuard();

  // Register global directive
  // 注册全局指令
  setupGlobDirectives(app);

  // Configure global error handling
  // 配置全局错误处理
  // setupErrorHandle(app);

  // https://next.router.vuejs.org/api/#isready
  await router.isReady();

  app.config.globalProperties.$http = axios;
  app.config.globalProperties.$Message = Message;
  app.config.globalProperties.$UiConfirm = UiConfirm;
  app.use(ViewUIPlus).use(ui).mount('#app');
}

bootstrap();
