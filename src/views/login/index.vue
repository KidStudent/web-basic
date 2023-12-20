<template>
  <div class="login-bg" v-if="systemConfig.applicationName">
    <div class="form-bg" />
    <div class="login-text">
      <img class="nav-logo" :src="systemConfig.logoUrl || navLogo" />
      <p class="login-cn">
        {{ systemConfig.applicationName }}
      </p>
    </div>
    <div class="login-wrapper">
      <div class="login-box" :class="loading ? 'login-loading' : ''" />
      <div class="login-container">
        <Form ref="loginFormRef" class="login-form" :model="loginForm" :rules="formRules">
          <FormItem prop="username">
            <Input
              type="text"
              v-model="loginForm.username"
              placeholder="请输入用户名"
              @on-enter="userEnter"
              :autofocus="!passwordFocus"
              clearable
              class="login-input"
            >
              <template #prefix>
                <i class="icon-font icon-yonghuming-01 login-icon" />
              </template>
            </Input>
          </FormItem>
          <FormItem prop="password">
            <Input
              type="password"
              v-model="loginForm.password"
              placeholder="请输入密码"
              :autofocus="passwordFocus"
              ref="passwordRef"
              @on-enter="login"
              class="login-input"
              password
            >
              <template #prefix>
                <i class="icon-font icon-mima-01 login-icon" />
              </template>
            </Input>
          </FormItem>
          <FormItem>
            <Button type="primary" :border="false" @click="pkiLogin" class="sign-button">
              PKI登录
            </Button>
            <Button type="primary" @click="login" class="sign-button">
              登&nbsp;&nbsp;&nbsp;&nbsp;录
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
    <div class="footer" v-if="systemConfig.showLogo">
      <div class="login-logo">
        <img src="@/assets/img/login/logo.png" alt="" />
      </div>
      <div class="line" />
      <div class="copyright">
        <p> 版本号: V {{ commonStore.localConfig.Version }} 推荐浏览器: Chrome 50 及以上版本 </p>
        <p>南京启数智能系统有限公司</p>
        <p>Copyright©2020-2022 南京启数智能系统有限公司 版权所有</p>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  @import './index.scss';
</style>
<script setup>
  import { onMounted, reactive, readonly, ref, getCurrentInstance, computed } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { navLogo } from './util/static';
  import md5 from 'md5';

  // import UseWebsocket from '@/stores/modules/websocket'
  import UseUserStore from '@/stores/modules/user';
  import UseCommonStore from '@/stores/modules/common';
  const userStore = UseUserStore();
  const commonStore = UseCommonStore();
  // const websocketStore = UseWebsocket()
  const systemConfig = computed(() => commonStore.systemConfig);

  const router = useRouter();
  const route = useRoute();

  const { proxy } = getCurrentInstance();

  let loading = ref(false);
  const loginForm = reactive({
    username: '',
    password: '',
  });
  const formRules = readonly({
    username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
    password: [
      { required: true, message: '密码不能为空', trigger: 'blur' },
      {
        required: true,
        message: '密码长度应为6～16个字符',
        min: 6,
        max: 16,
        trigger: 'blur',
      },
    ],
  });
  let passwordFocus = ref(false);
  const loginFormRef = ref(null);

  const passwordRef = ref(null);

  async function login() {
    try {
      let valid = await loginFormRef.value.validate();
      if (!valid) return;
      let res = null;
      loading.value = true;
      // loading-gif动画时间为2000毫秒
      const loadingTime = 1400;
      // 这里来记录接口返回时间 用来计算loading-gif的完成需要等待的剩余时间
      const sendDate = new Date().getTime();
      let param = 'username=' + loginForm.username + '&';
      param += 'password=' + md5(loginForm.password) + '&';
      param += 'grant_type=' + 'password' + '&';
      param += 'scope=' + 'server';
      res = await userStore.handleLogin(param);
      // 快过期提醒
      if (res.data.tips) {
        proxy.$Message.warning(res.data.tips);
      }
      const receiveDate = new Date().getTime();
      const time =
        loadingTime - (receiveDate - sendDate) > 0 ? loadingTime - (receiveDate - sendDate) : 10;
      setTimeout(() => {
        // window.sessionStorage.setItem("token", res.data.access_token); //存储token
        router.push({ path: '/', query: route.query });
        // 开启全局websoket
        // websocketStore.startWebsock();
        loading.value = false;
      }, time);
    } catch (err) {
      // this.$Message.error('登录失败');
      loading.value = false;
      console.log(err);
    }
  }

  function pkiLogin() {
    proxy.$Message.warning('暂未开启');
  }
  function userEnter() {
    passwordRef.value.focus();
  }

  onMounted(() => {
    loading.value = false;
    const username = window.sessionStorage.getItem('username');
    if (username) {
      passwordFocus.value = true;
      loginForm.username = username;
    } else {
      passwordFocus.value = false;
      loginForm.username = '';
    }
  });
</script>
