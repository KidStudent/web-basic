import { defineStore } from 'pinia';
import { router } from '@/router';
export default defineStore('tabs', {
  namespaced: true,
  state: () => ({
    cacheRouterList: [], //缓存的路由菜单列表
    activeRouterName: '',
  }),
  actions: {
    setCacheRouterList(cacheRouterList) {
      this.cacheRouterList = cacheRouterList;
    },
    /**
     * @param {当前要关闭的标签routerName} closeRouterName
     */
    closeCacheRouter(closeRouterName) {
      if (this.cacheRouterList.length === 1) {
        this.cacheRouterList.splice(0, 1);
        router.push({
          name: 'home',
        });
        return;
      }
      // 如果关闭的是当前路由标签，则需要判断向后或向前激活标签并跳转路由
      let routering = null;
      const index = this.cacheRouterList.findIndex((row) => row.name === closeRouterName);
      if (this.activeRouterName === closeRouterName) {
        const isLast = index === this.cacheRouterList.length - 1;
        if (isLast) {
          routering = this.cacheRouterList[index - 1];
        } else {
          routering = this.cacheRouterList[index + 1];
        }
        this.activeRouterName = routering.name;
        // 判断将要跳转的路由是否为创建组件标签，如果为创建组件标签，则跳转至组件所在路由地址，并且传入该组件名称参数
        if (!!routering && !!routering.meta) {
          router.push({
            name: routering.meta.routeName,
            query: Object.assign(routering.meta.queryParams, {
              componentName: routering.meta.componentName,
            }),
          });
        } else {
          router.push({
            name: this.activeRouterName,
          });
        }
      }
      this.cacheRouterList.splice(index, 1);
    },
    setActiveRouterName(activeRouterName) {
      this.activeRouterName = activeRouterName;
    },
  },
});
