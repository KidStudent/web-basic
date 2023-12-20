const id = 1024;
import { defineStore } from 'pinia';

export default defineStore('examplesRoutes', {
  namespaced: true,
  state: () => ({
    routerList: [
      {
        path: '/examples',
        name: 'examples',
        text: '组件库',
        id: id,
        parentId: null,
        iconName: 'zichanzhongxin', //菜单图标
        isExternalLink: false, //是否外部网站链接
      },
      {
        path: '/examples/examples-ui-modal',
        name: 'examples-ui-modal',
        text: '弹框',
        id: id + 'examples-ui-modal',
        parentId: id,
        component: '/examples/ui-modal', //路由对应文件
        iconName: '', //菜单图标
        isExternalLink: false, //是否外部网站链接
      },
      {
        path: '/examples/examples-ui-page',
        name: 'examples-ui-page',
        text: '分页',
        id: id + 'examples-ui-page',
        parentId: id,
        component: '/examples/ui-page', //路由对应文件
        iconName: '', //菜单图标
        isExternalLink: false, //是否外部网站链接
      },
      {
        path: '/examples/examples-ui-label',
        name: 'examples-ui-label',
        text: '标签',
        id: id + 'examples-ui-label',
        parentId: id,
        component: '/examples/ui-label', //路由对应文件
        iconName: '', //菜单图标
        isExternalLink: false, //是否外部网站链接
      },
      {
        path: '/examples/examples-ui-image',
        name: 'examples-ui-image',
        text: '加载图片',
        id: id + 'examples-ui-image',
        parentId: id,
        component: '/examples/ui-image', //路由对应文件
        iconName: '', //菜单图标
        isExternalLink: false, //是否外部网站链接
      },
      // 测试菜单用
      {
        path: '/examples/submenu-1',
        name: 'submenu-1',
        text: '二级菜单-1',
        id: id + 'submenu-1',
        parentId: id,
        iconName: 'zichanzhongxin', //菜单图标
      },
      {
        path: '/examples/submenu-1/submenu1-1',
        name: 'submenu1-1',
        text: '二级菜单1-1',
        id: id + 'submenu1-1',
        parentId: id + 'submenu-1',
        iconName: 'zichanzhongxin', //菜单图标
        component: '/examples/submenu1/submenu1-1', //路由对应文件
      },
      {
        path: '/examples/submenu-1/submenu1-2',
        name: 'submenu1-2',
        text: '二级菜单1-2',
        id: id + 'submenu1-2',
        parentId: id + 'submenu-1',
        iconName: 'zichanzhongxin', //菜单图标
      },
      {
        path: '/examples/submenu-1/submenu1-2/submenu1-2-1',
        name: 'submenu1-2-1',
        text: '二级菜单1-2-1',
        id: id + 'submenu1-2-1',
        parentId: id + 'submenu1-2',
        iconName: 'zichanzhongxin', //菜单图标
        component: '/examples/submenu1/submenu1-2/submenu1-2-1', //路由对应文件
      },
      {
        path: '/examples/submenu-1/submenu1-2/submenu1-2-2',
        name: 'submenu1-2-2',
        text: '二级菜单1-2-2',
        id: id + 'submenu1-2-2',
        parentId: id + 'submenu1-2',
        iconName: 'zichanzhongxin', //菜单图标
        component: '/examples/submenu1/submenu1-2/submenu1-2-2', //路由对应文件
      },
      {
        path: '/examples/submenu-2',
        name: 'submenu-2',
        text: '二级菜单-2',
        id: id + 'submenu-2',
        parentId: id,
        iconName: 'zichanzhongxin', //菜单图标
      },
      {
        path: '/examples/submenu-2/submenu2-1',
        name: 'submenu2-1',
        text: '二级菜单2-1',
        id: id + 'submenu2-1',
        parentId: id + 'submenu-2',
        iconName: 'zichanzhongxin', //菜单图标
        component: '/examples/submenu1/submenu2-1', //路由对应文件
      },
      {
        path: '/examples/submenu-2/submenu2-2',
        name: 'submenu2-2',
        text: '二级菜单2-2',
        id: id + 'submenu2-2',
        parentId: id + 'submenu-2',
        iconName: 'zichanzhongxin', //菜单图标
      },
      {
        path: '/examples/submenu-2/submenu2-2/submenu2-2-1',
        name: 'submenu2-2-1',
        text: '二级菜单2-2-1',
        id: id + 'submenu2-2-1',
        parentId: id + 'submenu2-2',
        iconName: 'zichanzhongxin', //菜单图标
        component: '/examples/submenu1/submenu2-2/submenu2-2-1', //路由对应文件
      },
      {
        path: '/examples/submenu-2/submenu2-2/submenu2-2-2',
        name: 'submenu2-2-2',
        text: '二级菜单2-2-2',
        id: id + 'submenu2-2-2',
        parentId: id + 'submenu2-2',
        iconName: 'zichanzhongxin', //菜单图标
        component: '/examples/submenu1/submenu1-2/submenu2-2-2', //路由对应文件
      },
    ],
  }),

  getters: {},

  actions: {},
});
