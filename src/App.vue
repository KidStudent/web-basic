<template>
  <layout-content />
</template>

<style lang="scss" scoped></style>
<script setup>
  import { logOutHook } from '@/hooks/web/logout';
  import { onMounted, watch, getCurrentInstance, computed } from 'vue';
  import UseWebsocket from '@/stores/modules/websocket';
  import UseCommonStore from '@/stores/modules/common';
  import UseUserStore from '@/stores/modules/user';
  import LayoutContent from '@/components/layout-content/index.vue';

  import { useRouter } from 'vue-router';
  const router = useRouter();
  const websocketStore = UseWebsocket();
  const userStore = UseUserStore();
  const websock = computed(() => websocketStore.websock);
  // 账号在别处登陆或者token失效
  const logOutFlag = computed(() => websocketStore.logOutFlag);
  const commonStore = UseCommonStore();
  const { proxy } = getCurrentInstance();

  // 退出登陆
  function websoketlogOut() {
    websock.value ? websocketStore.removeWebsocket() : null;
    // logOutHook中方法
    logOutHook();
    websocketStore.setLogOutFlag(false);
  }

  // 获取谷歌浏览器版本
  function getChromeVersion() {
    let userAgent = navigator.userAgent.split(' ');
    // 不是webkit的内核
    if (navigator.userAgent.indexOf('WebKit') === -1) {
      chromeVersionTips('您使用的浏览器版本过低，为了更好地体验请下载谷歌浏览器,');
      return;
    }
    // 谷歌浏览器版本小于50
    let chromeVersion = '';
    for (let i = 0; i < userAgent.length; i++) {
      if (/chrome/i.test(userAgent[i])) chromeVersion = userAgent[i];
    }
    if (Number(chromeVersion.split('/')[1].split('.')[0]) <= 50) {
      chromeVersionTips('您使用的谷歌浏览器版本过低，为了更好地体验请将浏览器升级版本,');
    }
  }

  function chromeVersionTips(text) {
    proxy.$Message.warning({
      duration: 20,
      closable: true,
      render: (h) => {
        return h('p', {}, [
          text,
          h(
            'a',
            {
              class: 'font-active-color ml-sm pointer',
              attrs: {
                href: '/temp/Chrome64.exe',
              },
            },
            ['点击下载'],
          ),
        ]);
      },
    });
  }

  function getTheme() {
    //  获取localStorage中存进去的type
    const type = localStorage.getItem('type');
    /**
     *  判断 localStorage 中的 type 是否为空，如果为空的话，就给默认的颜色（页面初始化的颜色），如
     *  果不为空的话就将对应获取到的值给到 data-skin
     **/
    if (type) {
      window.document.documentElement.setAttribute('web-basic-skin', localStorage.getItem('type'));
      commonStore.setThemeType(type);
    } else {
      window.document.documentElement.setAttribute('web-basic-skin', 'dark');
      commonStore.setThemeType('dark');
    }
  }

  onMounted(() => {
    // /* 多系统免登录跳转 */
    let url = window.location.href;
    if (url.includes('refresh_token')) {
      let token = url.substr(url.indexOf('refresh_token') + 14);
      userStore.setToken(token);
      window.sessionStorage.setItem('token', token);
      router.push({ name: '/' });
    }

    // 刷新组件，重新连接websoket
    // let token = window.sessionStorage.getItem("token");
    // !!token && !websock && !isLogin ? startWebsock() : null;
    getChromeVersion();
    getTheme();
  });

  watch(
    () => logOutFlag.value,
    (val) => {
      val ? websoketlogOut() : websocketStore.setLogOut(false);
    },
  );
</script>
