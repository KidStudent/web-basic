import axios from 'axios';
import { router } from '@/router';
import useCommon from '@/stores/modules/common';
import useUser from '@/stores/modules/user';

import { Message } from 'view-ui-plus';

import { getAuthInfo, getToken, formatToken } from '@/config/http/auth';

const defaultConfig = {
  timeout: 3000000,
};

const cancelToken = axios.CancelToken;

class CustomHttp {
  constructor() {
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
    this.cancelToken = axios.CancelToken;
  }

  /** token过期后，暂存待执行的请求 */
  static requests = [];

  /** 防止重复刷新token */
  static isRefreshing = false;

  /** 保存当前Axios实例对象 */
  static axiosInstance = axios.create(defaultConfig);

  /** 重连原始请求 */
  static retryOriginalRequest(config) {
    return new Promise((resolve) => {
      CustomHttp.requests.push((token) => {
        config.headers['Authorization'] = formatToken(token);
        resolve(config);
      });
    });
  }

  cancelToken = null;

  /** 取消请求 */
  static removePending = () => {
    CustomHttp.requests.forEach((row) => {
      row.f('请求取消');
    });
    CustomHttp.requests = [];
  };
  httpInterceptorsRequest() {
    CustomHttp.axiosInstance.interceptors.request.use(
      async (config) => {
        return new Promise((resolve) => {
          const commonStore = useCommon();
          // 记录日志
          // 这里如果没有传入该接口对应的菜单地址则使用浏览器现在的菜单地址
          if (!config.headers.resourceUrl) {
            config.headers['resourceUrl'] = router.currentRoute.value.path || '/';
          }
          if (
            config.url === '/qsdi-auth-service/oauth/token' ||
            config.url === '/qsdi-auth-service/oauth/token?grant_type=refresh_token'
          ) {
            config.headers['Authorization'] = 'Basic cXNkaTpxc2Rp';
            resolve(config);
          }

          config.cancelToken = new cancelToken((c) => {
            // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
            CustomHttp.requests.push({
              u: config.url + '&' + config.method,
              f: c,
            });
          });
          // 存储cancelToken可以用来阻止访问接口
          config.cancelToken = commonStore.source.token;
          const authInfo = getAuthInfo();
          const token = getToken();
          if (authInfo) {
            const userStore = useUser();
            const expired = authInfo.expires - new Date().getTime() <= 0;
            // 登录超时，无感刷新token
            if (expired) {
              if (!CustomHttp.isRefreshing) {
                CustomHttp.isRefreshing = true;
                userStore
                  .updateToken(authInfo.refreshToken)
                  .then((res) => {
                    const accessToken = res.access_token;
                    config.headers['Authorization'] = formatToken(accessToken);
                    // 重新触发之前因为token过期存储的请求
                    CustomHttp.requests.forEach((cb) => cb(accessToken));
                    CustomHttp.requests = [];
                  })
                  .catch((err) => {
                    console.log(err, 'err');
                  })
                  .finally(() => {
                    CustomHttp.isRefreshing = false;
                  });
              }
              // 暂时存储因为token过期没有发送的请求
              resolve(CustomHttp.retryOriginalRequest(config));
            } else {
              config.headers['Authorization'] = formatToken(token);
              resolve(config);
            }
          } else {
            // 免密登录
            !!token && (config.headers['Authorization'] = formatToken(token));
            resolve(config);
          }
        });
      },
      (err) => {
        return Promise.reject(err);
      },
    );
  }
  httpInterceptorsResponse() {
    CustomHttp.axiosInstance.interceptors.response.use(
      (response) => {
        // 获取json没有返回resultCode所以需要判断
        if (response.data.code) {
          let errorText = null;
          switch (response.data.code) {
            // 成功
            case 200:
              return response;
            // 成功
            case 417:
              return response;
            default:
              errorText = response.data.msg || '系统内部错误';
              Message.error(errorText);
              return Promise.reject(response);
          }
        }
        return response;
      },
      (error) => {
        const $error = error;
        $error.isCancelRequest = axios.isCancel($error);
        // 所有的响应异常 区分来源为取消请求/非取消请求
        if (error.code === 'ECONNABORTED') {
          //Message.error('请求超时');
          return Promise.reject(error);
        }
        if (error.response) {
          let errorText = error.response.data.msg || '系统内部错误';
          const url = error.response.config.url;
          const geoJsonErr = url.includes('/json/map-china-config');
          const regionCode = url.split('/').pop().split('.').shift();
          switch (error.response.status) {
            case 401:
              window.sessionStorage.clear();
              Message.error(errorText);
              CustomHttp.removePending();
              setTimeout(() => {
                router.replace({
                  name: 'login',
                  query: {
                    redirect: router.currentRoute.value.fullPath,
                  }, //登录成功后跳入浏览的当前页面
                });
              }, 1000);
              break;
            case 403:
              if (window.sessionStorage.getItem('authorUrl')) {
                window.location.href = `${window.sessionStorage.getItem(
                  'authorUrl',
                )}?redirect=${encodeURIComponent(window.location.href)}`;
              } else {
                window.location.href = window.location.host + '/404';
              }
              break;
            case 404:
              if (geoJsonErr) {
                Message.error({
                  content: `所选行政区域编码${regionCode}无实际区域展示`,
                  duration: 3,
                });
              } else {
                Message.error(errorText);
              }
              break;
            default:
              Message.error(errorText);
              break;
          }
        }
        return Promise.reject(error);
      },
    );
  }
  /** 通用请求工具函数 */
  // request(method, url, param, axiosConfig) {
  //   const config = {
  //     method,
  //     url,
  //     ...param,
  //     ...axiosConfig,
  //   }
  //   // 单独处理自定义请求/响应回掉
  //   return new Promise((resolve, reject) => {
  //     CustomHttp.axiosInstance
  //       .request(config)
  //       .then((response) => {
  //         resolve(response)
  //       })
  //       .catch((error) => {
  //         reject(error)
  //       })
  //   })
  // }

  /** 单独抽离的post工具函数 */
  post(url, data, config) {
    return CustomHttp.axiosInstance.post(url, data, config);
  }

  /** 单独抽离的get工具函数 */
  get(url, params, config) {
    return CustomHttp.axiosInstance.get(url, params, config);
  }

  /** 单独抽离的put工具函数 */
  put(url, data, config) {
    return CustomHttp.axiosInstance.put(url, data, config);
  }

  /** 单独抽离的delete工具函数 */
  delete(url, params, config) {
    return CustomHttp.axiosInstance.delete(url, params, config);
  }
}
const HttpRequest = new CustomHttp();
export default HttpRequest;
