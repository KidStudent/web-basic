// 传进来的正整数字符串变成三位一逗号的字符串
export function formatNum(str) {
  if (isNaN(+str)) {
    return '0';
  }
  str += '';
  let i = str.length > 3 ? str.length % 3 : 0;
  return (i ? `${str.substr(0, i)},` : '') + str.substr(i).replace(/(\d{3})(?=\d)/g, '$1' + ',');
}

// 过滤数据量过大变成999+
export function bigNum(num) {
  if (num > 999) {
    return `999+`;
  } else {
    return num;
  }
}

// 经纬度最多保留8位小数
export function filterLngLat(value) {
  let str = '';
  str = value ? String(value).replace(/^(.*\..{8}).*$/, '$1') : '';
  return str;
}

// 时间过滤（2021-07-13T02:42:01.983+00:00 转 YYYY-MM-DD hh:mm:ss）
export function filterDateFun(date) {
  if (!date) return date;
  var dateee = new Date(date).toJSON();
  return new Date(+new Date(dateee) + 8 * 3600 * 1000)
    .toISOString()
    .replace(/T/g, ' ')
    .replace(/\.[\d]{3}Z/, '');
}
