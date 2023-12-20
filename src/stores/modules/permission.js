import { defineStore } from 'pinia';
import { arrayToJson, deepCopy, geticonClassName } from '@/utils/common';
import UseCommonStore from './common';
import useUser from './user';
import useExamplesRoutes from './examplesRoutes';

const isDev = import.meta.env.MODE;

export default defineStore('permisssion', {
  namespaced: true,
  state: () => ({
    routerList: [], //有权限的路由
    routerTreeList: [], //有权限的树结构路由
    permissions: null, //所有权限标识
    leftMenuList: [], //左侧菜单列表
  }),

  getters: {
    // 根据路由name获取所有子路由
    getRouterChildrenByName: () => {
      return (name) => {
        let arr = [];
        this.routerList.forEach((row) => {
          if (row.name === name) {
            arr = row.children || [];
          }
        });
        return arr;
      };
    },
  },

  actions: {
    async setRouterList() {
      try {
        const commonStore = UseCommonStore();
        const userStore = useUser();
        const examples = useExamplesRoutes();
        // 获取菜单信息等
        const res = await userStore.getUserInfo();
        // 只返回页面或模块菜单
        const menus = res.data.data.resourceVoList.filter(
          (row) => row.resourceType === '1' || row.resourceType === '2',
        );
        const datascopeVoList = res.data.data.datascopeVoList;
        const permissions = res.data.data.permissions;
        this.routerList = menus.map((row) => {
          return {
            path: row.componentUrl || `/${row.resourceUrl}`,
            name: row.resourceUrl,
            text: row.resourceCname,
            id: row.id,
            parentId: row.parentId,
            component: row.componentUrl || `/${row.resourceUrl}`, //路由对应文件
            iconName: geticonClassName(row.iconUrl), //菜单图标
            isExternalLink: row.isExternalLink, //是否外部网站链接
          };
        });

        if (isDev) {
          this.routerList = [...this.routerList, ...examples.routerList];
        }

        this.routerTreeList = arrayToJson(deepCopy(this.routerList), 'id', 'parentId');
        this.permissions = permissions;
        commonStore.setOrganizationList(datascopeVoList);
      } catch (err) {
        console.log(err);
      }
    },
    setLeftMenuList(leftMenuList) {
      this.leftMenuList = leftMenuList;
    },
  },
});
