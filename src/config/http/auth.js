const authKey = 'auth-info';

/** 获取`authInfo` */
export function getAuthInfo() {
  return JSON.parse(sessionStorage.getItem(authKey));
}

/** 获取`token` */
export function getToken() {
  return sessionStorage.getItem('token');
}

/** 格式化token（jwt格式） */
export const formatToken = (token) => {
  return 'Bearer ' + token;
};
