/**
 * @description 验证8-20位数字或字母密码
 * @param {*} pwd 密码
 */
export const checkPwd = (pwd) => {
  const re = /^[a-zA-Z]\w{7,19}$/;
  if (re.test(pwd)) return true;
  else return false;
};

/**
 * @description 验证身份证号
 * @param {*} cardId 身份证号
 */
export const checkCardId = (cardId) => {
  // const idcard_patter = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  const idcard_patter =
    /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
  if (idcard_patter.test(cardId)) return true;
  else return false;
};

/**
 * @description 验证手机号码
 * @param {Number} phoneNumber 手机号
 */
export const checkPhone = (phoneNumber) => {
  const phone_number_patter = /^1(3|4|5|7|8)\d{9}$/;
  if (phone_number_patter.test(phoneNumber)) return true;
  else return false;
};

/**
 * @description 验证邮箱
 * @param {*} email 邮箱
 */
export const checkEmail = (email) => {
  const email_patter = /^\w+((-\w+)|(\.\w+))*\\@{1}\w+\.{1}\w{2,4}(\.{0,1}\w{2}){0,1}/gi;
  if (email_patter.test(email)) return true;
  else return false;
};

/**
 * @description 验证IP
 * @param {*} ip IP
 */
export const checkIp = (ip) => {
  const ip_patter =
    /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/gi;
  if (ip_patter.test(ip)) return true;
  else return false;
};

/**
 * @description 验证短号
 * @param {*} shortNumber 短号
 */
export const checkShortNumber = (shortNumber) => {
  const short_number_patter = /^\d{3,6}$/g;
  if (short_number_patter.test(shortNumber)) return true;
  else return false;
};
