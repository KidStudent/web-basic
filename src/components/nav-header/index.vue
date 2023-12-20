<template>
  <div class="nav-header">
    <div class="nav-body">
      <div class="nav-left">
        <div class="nav-logo fl">
          <img class="logo" :src="systemConfig.logoUrl || navTitle" />
        </div>
        <div class="system-name">
          {{ systemConfig.applicationName }}
        </div>
      </div>

      <ui-menu class="nav-menu" :active="activeRouter" mode="horizontal">
        <!-- <menu-item name="home" @selectMenu="selectHome">
          <i class="iconfontconfigure icon-shouye-xuanzhong1 f-16 mr-sm"></i>
          <span class="inline vt-middle">首页</span>
        </menu-item> -->
        <template v-for="(item, index) in menuList" :key="index">
          <menu-item :name="item[menuProp.menuName]" @selectMenu="selectNav">
            <i class="iconfontconfigure mr-sm" :class="`icon-${item[menuProp.menuIcon]}`" />
            <span class="inline vt-middle">{{ item[menuProp.menuText] }}</span>
          </menu-item>
        </template>
      </ui-menu>

      <div class="nav-right">
        <Icon
          :type="themeType === 'light' ? 'ios-sunny-outline' : 'ios-moon-outline'"
          @click="changeTheme"
          class="mr-sm f-20 font-white"
        />
        <div class="user-box user-center">
          <author-poptip v-if="effectiveDays <= noticeDay" :effective-days="effectiveDays" />
          <Dropdown @on-click="onClickUserCenter" class="dropdown">
            <a href="javascript:void(0)" @click="onClickUserCenter()">
              <div class="user-avatar vt-middle">
                <ui-avatar :src="userInfo.avatar" />
              </div>
              <div class="user-name vt-middle">
                <span>{{ userInfo.name }}</span>
              </div>
            </a>
            <template #list>
              <DropdownMenu>
                <DropdownItem
                  v-for="(item, index) in systemList"
                  :key="index"
                  :name="JSON.stringify(item)"
                  >{{ item.applicationName }}</DropdownItem
                >
              </DropdownMenu>
            </template>
          </Dropdown>
          <!-- <Tooltip content="个人中心"
            ><div class="user-avatar vt-middle">
              <ui-avatar :src="userInfo.avatar"></ui-avatar>
            </div>
            <div class="user-name vt-middle">
              <span>{{ userInfo.name }}</span>
            </div>
          </Tooltip> -->
        </div>

        <div class="user-box xiao-xi">
          <Tooltip content="消息">
            <i class="icon-font icon-xiaoxi1 message" />
          </Tooltip>
        </div>
        <div class="user-box">
          <Tooltip content="退出">
            <div class="exit-icon" @click="logOut">
              <i class="icon-font icon-tuichuanniu log-out f-14" />
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .nav-header {
    @include background_image('navBackgroundImg');

    height: 53px;
    // padding: 0 20px;
    padding-right: 20px;
    background-size: cover;
    // background-size: 100% 100%;
    .nav-body {
      display: flex;
      width: 100%;
      height: 100%;
    }

    .nav-left {
      display: flex;
      height: 100%;
      letter-spacing: 2px;
      align-items: center;

      img {
        height: 100%;
      }
    }

    .nav-menu {
      margin-left: 100px;
    }

    .nav-right {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 100%;

      .user-box {
        display: flex;
        height: 24px;
        text-align: center;
        cursor: pointer;
        align-items: center;
        justify-content: center;

        .log-out {
          line-height: 14px;
          color: #fff;
        }

        .message {
          font-size: 17px;
          color: #bcdbf5;
        }

        .user-avatar {
          display: inline-block;
          height: 32px;
        }

        .user-name {
          display: inline-block;
          height: 32px;
          max-width: 150px;
          margin-left: 10px;
          overflow: hidden;
          font-weight: bold;
          color: #bcdbf5;
          text-overflow: ellipsis;
          white-space: nowrap;

          span {
            line-height: 32px;
          }
        }

        .exit-icon {
          display: flex;
          width: 24px;
          height: 24px;
          background: #f8775c;
          border-radius: 50%;
          justify-content: center;
          align-items: center;
        }
      }
    }

    .nav-title {
      line-height: 53px;
    }

    .nav-logo {
      width: 80px;
      height: 36px;
      text-align: center;
      // margin-right: 10px;
      .logo {
        height: 100%;
        // width: 100%;
      }
    }

    .arrow {
      transform: scale(0.83);
      transition: all 0.2s linear;
    }

    .system-name {
      position: relative;
      min-width: 272px;
      font-size: 22px;
      font-weight: bold;
      line-height: 53px;
      cursor: pointer;
      background: linear-gradient(to top, #6d7889 0%, #fff 30%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;

      &:hover {
        .arrow {
          transform: rotateZ(180deg);
        }
      }
    }

    .drop-item-active {
      color: #06bde6;
      background-color: #041e43;
      border-color: #10c0e6;
    }

    :deep(.ivu-menu) {
      z-index: 700;
    }

    .person-pic {
      margin-right: 10px;
    }

    .xiao-xi {
      padding-right: 20px;
      margin-right: 20px;
      border-right: 1px solid #7ab5f1;
    }

    .user-center {
      margin-right: 21px;
    }

    .notice-icon {
      margin-right: 10px;
      font-size: 26px;
      color: #94b3d0;
    }

    .notice {
      position: relative;
      margin-right: 15px;

      &:hover {
        .icon-xiaoxi {
          color: #bec7d2;
        }
      }

      .icon-xiaoxi {
        color: #6e86aa;
      }

      .notice-num {
        position: absolute;
        top: 4px;
        left: 15px;
        display: inline-block;
        min-width: 24px;
        padding: 6px;
        font-size: 16px;
        line-height: 12px;
        color: #fff;
        text-align: center;
        background-color: #f4442d;
        border-radius: 17px;
        transform: scale(0.6);
      }
    }
  }
</style>
<script setup>
  import { onMounted, watch, reactive, getCurrentInstance, ref, computed } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { navTitle } from './util/static';

  import { logOutHook } from '@/hooks/web/logout';

  import MenuItem from '@/components/ui-menu/menu-item.vue';
  import UiMenu from '@/components/ui-menu/ui-menu.vue';
  import UiAvatar from '@/components/ui-avatar/index.vue';
  import AuthorPoptip from '@/components/author-poptip/index.vue';

  import common from '@/config/api/common';
  import user from '@/config/api/user';

  import useCommon from '@/stores/modules/common';
  import useUser from '@/stores/modules/user';
  import usePermission from '@/stores/modules/permission';

  const commonStore = useCommon();
  const userStore = useUser();
  const permissionStore = usePermission();
  const router = useRouter();
  const route = useRoute();
  const { proxy } = getCurrentInstance();

  let activeRouter = ref(''); //路由激活名字
  let effectiveDays = ref(0);
  let noticeDay = ref(0);
  const systemList = reactive([
    { applicationName: '个人中心', name: 'usercenter' },
    { applicationName: '我的下载', name: 'downloadcenter' },
  ]);
  let themeType = ref('');
  const systemConfig = computed(() => commonStore.systemConfig);
  const routerList = computed(() => permissionStore.routerList);
  const userInfo = computed(() => userStore.userInfo);

  const props = defineProps({
    menuList: {
      type: Array,
      required: true,
    }, //菜单列表
    menuProp: {
      type: Object,
      default: () => {
        return {
          menuChildren: 'children',
          menuName: 'name',
          menuText: 'text',
          menuIcon: 'iconName',
        };
      },
    },
  });

  onMounted(async () => {
    getPath();
    applicationList();
    proxy.$http
      .get(common.getAuthorNoticeDay)
      .then((res) => {
        if (res.data.data) {
          noticeDay.value = res.data.data.paramValue;
        }
      })
      .catch(() => {});
    effectiveDays.value = commonStore.authorInfo ? commonStore.authorInfo.effectiveDays : 0;
    themeType.value = localStorage.getItem('type');
  });

  // 监听路由变化更改菜单的激活状态
  watch(
    () => route.name,
    () => {
      getPath();
    },
  );

  // 获取应用
  function applicationList() {
    proxy.$http.get(user.getSysApplicationInfo).then((res) => {
      res.data.data.map((val) => {
        if (val.applicationCode !== commonStore.localConfig.ApplicationCode) {
          systemList.push(val);
        }

        // 工具集跳转采集系统管理平台
        if (val.applicationCode === '00000004') {
          userStore.setManagerAppUrl(val.address);
        }
      });
    });
  }

  function onClickUserCenter(val) {
    if (!val) {
      addTab({ applicationName: '个人中心', name: 'usercenter' });
      return;
    }
    let obj = JSON.parse(val);
    if (!obj.applicationCode) {
      addTab(obj);
    } else {
      window.open(obj.address + '?refresh_token=' + userStore.token);
    }
  }

  //添加标签
  function addTab(route) {
    router.push({
      name: route.name,
    });
  }

  // 获取路由来激活某个菜单的active属性
  function getPath() {
    getActiveRoute(route.name);
  }

  function getActiveRoute(name) {
    const router = routerList.value.find((row) => row.name === name);
    if (!router) {
      activeRouter.value = name;
      return false;
    }
    if (router.parentId) {
      const parentRouter = routerList.value.find((row) => row.id === router.parentId);
      getActiveRoute(parentRouter.name);
    } else {
      activeRouter.value = router.name;
    }
  }

  async function selectNav(name) {
    const menu = props.menuList.find((row) => row.name === name);
    if (menu.isExternalLink) {
      switch (menu.name) {
        default:
          window.open(menu.name, '_blank');
          break;
      }
    } else {
      router.push({ name: name });
    }
  }

  function logOut() {
    proxy.$UiConfirm({ content: '您确定要退出吗？' }).then(() => {
      logOutHook();
    });
  }

  // 点击对应的颜色块进行一键换肤
  function changeTheme() {
    themeType.value = themeType.value === 'light' ? 'dark' : 'light';
    // 将对应的数据存储到localStorage，方便后续使用
    localStorage.setItem('type', themeType.value);
    // 全局添加样式名称：data-skin，并在localStorage获取对应的样式名称的值。
    window.document.documentElement.setAttribute('web-basic-skin', localStorage.getItem('type'));
    commonStore.setThemeType(themeType.value);
    // this.$util.doEcharts.changeColor();
  }
</script>
