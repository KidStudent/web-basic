import axios from './http';
import user from '../api/user';
import UseUserStore from '@/stores/modules/user';
/**
 * key: 1:默认,2:江苏省厅,3:河北(石家庄),4:四川省厅,5:内江市局,6:四川高新区,7:济南市局,8:甘肃省厅,9:兰州,10:乌市
 * 属性 validateParams: 校验对应参数是否存在
 * 属性 loginAsync: 对应的登陆方法
 */
const validateMust = (params, must) => {
  let start = 0;
  const mustLength = must.length;
  while (start < mustLength) {
    if (!Object.keys(params).includes(must[start])) {
      return false;
    }
    start++;
  }
  return true;
};

const ssoConfig = {
  '4': {
    must: ['token'],
    validateParams: validateMust,
    loginAsync: async (params) => {
      try {
        const userStore = UseUserStore();
        const res = await axios.get(user.tokenWsUniportalCheck, { params });
        userStore.setSystemData(res.data.data);
        sessionStorage.setItem('isSSO', '1');
        console.info('第三方登录成功');
        return true;
      } catch (err) {
        console.error(err, 'err');
        return false;
      }
    },
    getUserInfo: async () => {
      try {
        const res = await axios.post(user.userWsInfo);
        return res;
      } catch (err) {
        console.error(err, 'err');
      }
    },
  },
};

export default ssoConfig;
