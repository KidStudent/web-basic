<template>
  <div class="layout" ref="layoutRef">
    <nav-header v-if="!needHeader" :menu-list="routerTreeList" />
    <Layout v-if="!needHeader" class="layout-self">
      <Sider
        ref="side"
        hide-trigger
        collapsible
        :collapsed-width="60"
        :value="isCollapsed"
        :width="240"
        :class="isCollapsed ? 'collapsed-sider' : ''"
        v-show="!!leftMenuList.length && hasCollapse"
      >
        <nav-Left :menu-list="leftMenuList" :is-collapsed="isCollapsed" @selectMenu="selectMenu" />
      </Sider>
      <Layout>
        <Header class="layout-header-bar">
          <!-- <router-link
            to="/home"
            tag="span"
            class="option go-home pointer"
            :class="homeActive ? 'active' : ''"
          >
            <i class="icon-font icon-zhuyegudingdaohang f-14"></i>
          </router-link> -->
          <ui-menu-tabs
            class="ui-tabs"
            :value="activeRouterName"
            @on-click="selectRouter"
            @on-tab-remove="closeRouter"
            @on-contextmenu="onContextmenu"
          >
            <ui-menu-tab-pane
              v-for="(item, index) in cacheRouterList"
              :key="index"
              :name="item.name"
              :label="item.text"
              :meta="item.meta"
              :closable="hasClosed(index)"
            />
            <template #contextmenu>
              <ul class="right-menu">
                <li @click="closeTabs(1)">关闭其他标签页</li>
                <li @click="closeTabs(2)">关闭所有标签页</li>
                <li @click="closeTabs(3)">关闭当前标签页</li>
              </ul>
            </template>
          </ui-menu-tabs>
        </Header>
        <Content class="layout-content margin-wrapper-flow" :class="{ p0: isHome }">
          <router-view class="height-full" #default="{ Component }">
            <keep-alive :include="cacheRouterName">
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </Content>
      </Layout>
    </Layout>
    <router-view v-else :class="{ 'wrapper-full': !needHeader }" />
    <div class="menu-icon" @click="collapsedSider" v-show="!!leftMenuList && !!leftMenuList.length">
      <i :class="rotateIcon" />
    </div>
  </div>
</template>
<script setup>
  import { computed, nextTick, onMounted, readonly, ref, watch } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import useCommon from '@/stores/modules/common';
  import UsePermission from '@/stores/modules/permission';
  import useTabs from '@/stores/modules/tabs';
  import useUser from '@/stores/modules/user';
  import { useWatermark } from '@/hooks/component/watermark';
  import NavHeader from '@/components/nav-header/index.vue';
  import NavLeft from '@/components/nav-left/index.vue';
  import UiMenuTabs from '@/components/ui-menu-tabs/ui-tabs.vue';
  import UiMenuTabPane from '@/components/ui-menu-tabs/ui-tab-pane.vue';

  const commonStore = useCommon();
  const permissionStore = UsePermission();
  const tabsStore = useTabs();
  const userStore = useUser();

  const router = useRouter();
  const route = useRoute();

  let rightClickName = ref(null);
  let hasCollapse = ref(true);
  const fullScreenRoutes = readonly(['login', '404']);
  const needHeader = computed(() => {
    return !route.name || fullScreenRoutes.includes(route.name);
  });

  const routerTreeList = computed(() => permissionStore.routerTreeList);
  const routerList = computed(() => permissionStore.routerList);
  const leftMenuList = computed(() => permissionStore.leftMenuList);
  const cacheRouterList = computed(() => tabsStore.cacheRouterList);
  const cacheRouterName = computed(() => cacheRouterList.value.map((row) => row.name));
  const activeRouterName = computed(() => tabsStore.activeRouterName);
  const isCollapsed = computed(() => commonStore.isCollapsed);
  const localConfig = computed(() => commonStore.localConfig);
  const userInfo = computed(() => userStore.userInfo);

  // 水印
  const layoutRef = ref(null);

  const rotateIcon = computed(() => [
    'icon-font',
    hasCollapse.value ? 'icon-indent' : 'icon-outdent',
  ]);
  const isHome = computed(() => route.path === '/home');

  // 缩放左侧菜单
  function collapsedSider() {
    hasCollapse.value = !hasCollapse.value;
  }

  // 选中左侧菜单列表
  function selectMenu(name) {
    const index = cacheRouterList.value.findIndex((row) => row.name === name);
    if (index === -1) {
      const router = routerList.value.find((item) => item.name === name);
      cacheRouterList.value.push(router);
      setCacheRouterList(cacheRouterList.value);
    }
    router.push({ name: name });
  }
  // 选中标签页
  function selectRouter(name, meta) {
    setActiveRouterName(name);
    // 如果选中的为组件标签，则跳转至组件标签所在地址，并且传入该组件名称参数
    if (meta) {
      router.push({
        name: meta.routeName,
        query: Object.assign(meta.queryParams, {
          componentName: meta.componentName,
        }),
      });
    } else {
      router.push({ name: name });
    }
  }

  // 关闭标签页
  function closeRouter(name) {
    // 如果关闭的是当前路由标签，则需要判断向后或向前激活标签并跳转路由
    tabsStore.closeCacheRouter(name);
  }

  // 右击标签页
  function onContextmenu(name) {
    rightClickName.value = name;
  }

  function setCacheRouterList(router) {
    tabsStore.setCacheRouterList(router);
  }

  function setActiveRouterName(name) {
    tabsStore.setActiveRouterName(name);
  }

  function setLeftMenuList(menu) {
    permissionStore.setLeftMenuList(menu);
  }

  // 右击菜单点击其中选项触发事件
  function closeTabs(num) {
    let routerItem = null;
    switch (num) {
      case 1:
        routerItem = cacheRouterList.value.find((row) => row.name === rightClickName.value);
        setCacheRouterList([routerItem]);
        if (activeRouterName.value !== routerItem.name) {
          setActiveRouterName(routerItem.name);
          if (routerItem.meta) {
            router.push({
              name: routerItem.meta.routeName,
              query: Object.assign(routerItem.meta.queryParams, {
                componentName: routerItem.meta.componentName,
              }),
            });
          } else {
            router.push({ name: activeRouterName.value });
          }
        }
        break;
      case 2:
        setCacheRouterList([]);
        router.push({ name: 'home' });
        break;
      case 3:
        closeRouter(rightClickName.value);
        break;
    }
  }

  // 获取标签页激活状态
  function getTabsActive() {
    const componentName = route.query.componentName || null;
    // 如果路由参数中存在组件标签参数，则激活名称为组件标签名称，否则为当前路由名称
    if (componentName) {
      const router = cacheRouterList.value.find(
        (row) => !!row.meta && row.meta.componentName === componentName,
      );
      setActiveRouterName(router.name);
    } else {
      setActiveRouterName(route.name);
    }
  }

  function recursiveTreeByLastLevel(name) {
    // debugger
    const route = routerList.value.find((row) => row.name === name);
    if (!route) return;
    if (route.parentId) {
      const parentRoute = routerList.value.find((row) => row.id === route.parentId);
      recursiveTreeByLastLevel(parentRoute.name);
    } else {
      const menu = routerTreeList.value.find((row) => {
        return row.name === route.name;
      });
      setLeftMenuList(menu.children || []);
    }
  }

  function getNavLeftMenu() {
    setLeftMenuList([]);
    recursiveTreeByLastLevel(route.name);
  }

  function hasClosed(index) {
    if (index === 0) {
      return cacheRouterList.value.length === 1 ? false : true;
    } else {
      return true;
    }
  }

  function setWatermarkDefault() {
    nextTick(() => {
      const { setWatermark } = useWatermark(layoutRef.value);
      setWatermark(userInfo.value.name);
    });
  }

  onMounted(() => {
    // 将存在session中的缓存路由读取出来
    const cacheRouter = sessionStorage.getItem('cacheRouter');
    if (cacheRouter) {
      setCacheRouterList(JSON.parse(cacheRouter));
    }
    // 监听浏览器刷新页面，刷新时存入vuex中已经缓存的菜单到session中
    window.addEventListener('beforeunload', () => {
      if (!sessionStorage.getItem('token')) return;
      sessionStorage.setItem('cacheRouter', JSON.stringify(cacheRouterList.value));
    });
    // 获取标签选中状态
    getTabsActive();
    // 获取左侧菜单列表
    getNavLeftMenu();
  });

  watch(
    () => route.name,
    () => {
      getTabsActive();
      getNavLeftMenu();
    },
  );

  watch(cacheRouterList.value, () => {
    getTabsActive();
  });

  watch(
    [() => userInfo.value.name, () => localConfig.value.ShowWaterMark],
    ([userval, localval]) => {
      if (userval && localval) {
        // 加载默认水印
        setWatermarkDefault();
      }
    },
    { immediate: true },
  );
</script>
<style lang="scss" scoped>
  .p0 {
    padding: 0;
  }

  .ivu-layout-sider {
    @include background_color('layoutSiderBg');

    width: 240px !important;
    max-width: 240px !important;
    min-width: 240px !important;
    flex: 0 0 240px !important;
  }

  .layout {
    position: relative;
    height: 100%;
    overflow: hidden;
    clear: both;
    background: #f5f7f9;

    .menu-icon {
      position: absolute;
      bottom: 10px;
      left: 0;
      z-index: 9999;
      width: 50px;
      height: 25px;
      padding-left: 10px;
      line-height: 25px;
      cursor: pointer;
      background: linear-gradient(270deg, rgb(43 132 226 / 0%) 0%, #2b84e2 100%);

      i {
        font-size: 18px;
        color: rgb(255 255 255 / 65%);
        //height: 20px;
        //line-height: 20px;
        &:hover {
          color: #fff;
        }
      }
    }

    .layout-self {
      height: calc(100% - 53px);

      .collapsed-sider {
        width: 80px !important;
        max-width: 80px !important;
        min-width: 80px !important;
        flex: 0 0 80px !important;
      }

      :deep(.ivu-layout-sider-children) {
        margin-top: 0;
      }
    }

    .layout-header-bar {
      @include background_color('layoutHeaderBarBg');
      @include shadow('layoutHeaderBarShadow');

      position: relative;
      z-index: 1;
      height: 36px;
      padding: 0;

      .option {
        display: flex;
        width: 36px;
        height: 36px;
        color: #768192;
        align-items: center;
        justify-content: center;

        &:hover {
          color: #fff;
          background-color: #0d3560;
        }

        &.active {
          color: #fff;
          background-color: #0d3560;
        }

        &.go-home {
          position: absolute;
          left: 36px;
          z-index: 1;
          width: 41px;
          border-right: 1px solid;
          border-color: $boder_color_07355E;
        }
      }

      .router-list {
        height: 36px;
        line-height: 36px;
      }
    }

    .layout-content {
      @include background_color('layoutBackGround');

      height: 100%;
      overflow-y: auto;
    }
  }

  .right-menu {
    li {
      padding: 7px 16px;
      line-height: 20px;
      color: #fff;

      &:hover {
        background-color: #0d3560;
      }
    }
  }
</style>
