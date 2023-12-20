import axios from '@/config/http/http';
import { Message } from 'view-ui-plus';
import { getAsyncRoutes } from '@/router/asyncRouter';
import { router } from '@/router';
import ssoLogin from '@/config/http/sso';
import UseCommonStore from '@/stores/modules/common';
import usePermissionStore from '@/stores/modules/permission';
import useTabsStore from '@/stores/modules/tabs';

export function setupRouterGuard() {
  // 路由钩子，做一些跳转的配置
  router.beforeEach((to, from, next) => {
    try {
      const commonStore = UseCommonStore();
      // 当切换路由时阻止正在访问的接口全部取消访问
      const CancelToken = axios.cancelToken;
      commonStore.source.cancel && commonStore.source.cancel('取求');
      commonStore.setSource(CancelToken.source());

      // 判断是否授权
      const author = !!window.sessionStorage.getItem('authorInfo');
      if (author && author !== 'undefined') {
        commonStore.setAuthor(
          window.sessionStorage.getItem('authorInfo')
            ? JSON.parse(window.sessionStorage.getItem('authorInfo'))
            : '',
        );
        init(to, from, next);
      } else {
        commonStore
          .getAuthor()
          .then(() => {
            init(to, from, next);
          })
          .catch((url) => {
            next();
            window.sessionStorage.setItem('authorUrl', url);
            window.location.href = `${url}?redirect=${encodeURIComponent(window.location.href)}`;
            return;
          });
      }
      // init(to, from, next)
    } catch (err) {
      console.log(err);
    }
  });
  // 可以根据跳转到的页面，显示不同颜色的loadingBar
  router.afterEach(() => {});
}

async function init(to, from, next) {
  const commonStore = UseCommonStore();
  const permissionStore = usePermissionStore();
  const tabsStore = useTabsStore();
  // 获取系统配置信息
  !Object.keys(commonStore.systemConfig).length && (await commonStore.setSystemConfig());
  await ssoLogin();
  const hasToken = !!window.sessionStorage.getItem('token');
  const route = permissionStore.routerList;
  const hasRouters = route && route.length > 0;
  /**
   * 处于已登录已组装路由则直接进入
   */
  if (hasToken && hasRouters) {
    const route = tabsStore.cacheRouterList.find((row) => row.path === to.path);
    if (!route) {
      let cacheRouterList = tabsStore.cacheRouterList;
      const newRoute = permissionStore.routerList.find((row) => row.path === to.path);
      if (newRoute) cacheRouterList.push(newRoute);
      tabsStore.setCacheRouterList(cacheRouterList);
    }
    next();
  }
  /**
   * 如果处于已登录未获取路由状态则去组装路由
   */
  if (hasToken && !hasRouters) _getRoutes(to, from, next);
  /**
   * 如果处于未登录状态则跳转到login页面
   */
  if (!hasToken && !hasRouters) {
    if (to.name === 'login') {
      next();
    } else {
      next({
        name: 'login',
        query: {
          ...to.query,
          redirect: to.path,
        }, //登录成功后跳入浏览的当前页面
      });
    }
  }
}

async function _getRoutes(to, from, next) {
  try {
    const permissionStore = usePermissionStore();
    await permissionStore.setRouterList();
    const accessRoutes = getAsyncRoutes(permissionStore.routerList);
    if (accessRoutes.length > 0) {
      // 动态添加格式化过的路由
      accessRoutes.forEach((route) => {
        router.addRoute(route);
      });

      /**
       * 如果有重定向路由则直接跳转到重定向
       */
      const query = to.query;
      const redirect = to.query.redirect;
      if (redirect) {
        delete query.redirect;
        next({
          path: redirect,
          query: query,
          replace: true,
        });
        return;
      }
      /**
       * 由于路由是动态创建的，初次进入时还未载入，这时会进入到404页面中
       * 路由动态添加完成后需要重新载入要进入的路由，
       * 如果是重定向路由，从缓存的路由列表中找到需要重定向进入的路由
       * 如果是指定路由则替换即可
       */
      if (to.name === '/') {
        const redirectRoute = accessRoutes.find((row) => row.name === '/');
        next({
          ...redirectRoute,
          query: query,
          replace: true,
        });
      } else if (to.name === 'login') {
        next({
          name: '/',
        });
      } else {
        next({
          path: to.fullPath,
          query: to.query,
          replace: true,
        });
      }
    } else {
      Message.warning('该用户未分配菜单权限,请联系管理员分配！');
      if (to.name === 'login') {
        next();
      } else {
        next({
          name: 'login',
        });
      }
    }
  } catch (err) {
    console.log(err, 'err');
    next({
      name: 'login',
    });
  }
}
