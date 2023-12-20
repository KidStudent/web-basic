import { defineStore } from 'pinia';
import user from '@/config/api/user';
import axios from '@/config/http/http';
import UseCommonStore from './common';
import ssoConfig from '@/config/http/sso-config';

export default defineStore('user', {
  namespaced: true,
  state: () => ({
    token: window.sessionStorage.getItem('token') || '',
    refreshToken: window.sessionStorage.getItem('refreshToken') || '',
    expirationTimestamp: 0, //token失效时间
    expiresIn: 0, //token失效时间间隔
    userInfo: {},
    managerAppUrl: '', // 采集系统地址
  }),
  getters: {},
  actions: {
    setToken(token) {
      this.token = token;
      window.sessionStorage.setItem('token', this.token);
    },
    /**
     * 登录
     * @param params {username: "", password: ""}
     * @returns {Promise<unknown>}
     */
    handleLogin(params) {
      return new Promise((resolve, reject) => {
        axios
          .post(user.login, params)
          .then((res) => {
            const data = res.data;
            this.setSystemData(data);
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    /**
     * 保存登录的系统信息
     * @param {*} data
     */
    setSystemData(data) {
      this.token = data.access_token;
      this.refreshToken = data.refresh_token;
      this.expiresIn = data.expires_in;
      const authInfo = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expires: new Date().getTime() + data.expires_in * 1000,
      };
      window.sessionStorage.setItem('auth-info', JSON.stringify(authInfo));
      window.sessionStorage.setItem('token', this.token);
      window.sessionStorage.setItem('expirationTimestamp', this.expirationTimestamp);
      const userMessage = {
        username: data.username,
        user_id: data.user_id,
        orgList: data.orgList,
      };
      window.sessionStorage.setItem('userMessage', JSON.stringify(userMessage)); //存储登录人员信息
    },
    // 获取用户相关信息
    async getUserInfo() {
      try {
        const commonStore = UseCommonStore();
        const distinguishVersion = commonStore.systemConfig.distinguishVersion;
        let res = null;
        const isSSO = sessionStorage.getItem('isSSO');
        // 如果是单点登录以及有配置单点登录获取登录的用户信息就从另外配置的接口获取
        if (isSSO === '1' && ssoConfig[distinguishVersion]?.getUserInfo) {
          res = await ssoConfig[distinguishVersion].getUserInfo();
        } else {
          res = await axios.get(user.getUserInfo, {
            params: {
              applicationCode: commonStore.localConfig.ApplicationCode,
            },
          });
        }

        const { sysUser, roleVoList, orgVoList } = res.data.data;
        const userInfo = {
          ...sysUser,
          roleVoList,
          orgVoList,
        };
        this.userInfo = userInfo;
        return res;
      } catch (err) {
        console.error(err, 'err');
      }
    },
    // 刷新token
    updateToken(token) {
      let params = 'scope=server' + '&' + 'refresh_token=' + token;
      return new Promise((resolve, reject) => {
        axios
          .post(user.updateToken, params)
          .then((res) => {
            if (res && res.data) {
              this.token = res.data;
              const authInfo = {
                accessToken: res.data.access_token,
                refreshToken: res.data.refresh_token,
                expires: new Date().getTime() + res.data.expires_in * 1000,
              };
              sessionStorage.setItem('auth-info', JSON.stringify(authInfo));
              resolve(res.data);
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    setManagerAppUrl(url) {
      this.managerAppUrl = url;
    },
  },
});
