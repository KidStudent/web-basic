import { createRouter, createWebHistory } from 'vue-router';

export const constantRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
  },
  // {
  //   path: '/usercenter',
  //   name: 'usercenter',
  //   component: () => import('@/views/user-center/index.vue'),
  // },
  // {
  //   path: '/downloadcenter',
  //   name: 'downloadcenter',
  //   component: () => import('@/views/download-center/index.vue'),
  // },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/views/error-page/404.vue'),
  },
  {
    path: '/',
    name: '/',
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  strict: true,
});

export function setupRouter(app) {
  app.use(router);
}
