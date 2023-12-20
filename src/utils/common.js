import CryptoJS from 'crypto-js';
import iconsList from '@/assets/configureIcons/iconfont.json';
/**
 * 深拷贝
 */
//返回传递给他的任意对象的类
export function isClass(o) {
  if (o === null) return 'Null';
  if (o === undefined) return 'Undefined';
  return Object.prototype.toString.call(o).slice(8, -1);
}

export function deepCopy(obj) {
  if (!obj) {
    return null;
  }
  let result,
    oClass = isClass(obj);
  //确定result的类型
  if (oClass === 'Object') {
    result = {};
  } else if (oClass === 'Array') {
    result = [];
  } else {
    return obj;
  }

  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      let copy = obj[key];
      if (isClass(copy) === 'Object') {
        result[key] = deepCopy(copy); //递归调用
      } else if (isClass(copy) === 'Array') {
        result[key] = deepCopy(copy);
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
}
// 时间戳转换成天年月日
export function timeFn(dateDiff, format) {
  let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
  let leave1 = dateDiff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
  let hours = Math.floor(leave1 / (3600 * 1000)); //计算出小时数
  //计算相差分钟数
  let leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
  let minutes = Math.floor(leave2 / (60 * 1000)); //计算相差分钟数
  //计算相差秒数
  let leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
  let seconds = Math.round(leave3 / 1000);
  if (!format) {
    format = 'dd天hh时mm分ss秒';
  }
  const o = {
    'd+': dayDiff, //day
    'h+': hours, //hour
    'm+': minutes, //minute
    's+': seconds, //second
  };

  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substring(('' + o[k]).length),
      );
    }
  }
  return format;
}
/*
 *将Date/String类型,解析为String类型.
 *传入String类型,则先解析为Date类型
 *不正确的Date,返回 ''
 *如果时间部分为0,则忽略,只返回日期部分.
 *日期格式对应字符如下(年-yyyy,月-MM,日-dd,时-hh,分-mm,秒-ss,毫秒-S 字符区分大小写)
 */
export function formatDate(v, format) {
  if (!format) {
    format = 'yyyy-MM-dd hh:mm:ss';
  }
  if (typeof v == 'string') v = this.parseDate(v);
  if (!(v instanceof Date)) {
    return '';
  }
  var o = {
    'M+': v.getMonth() + 1, //month
    'd+': v.getDate(), //day
    'h+': v.getHours(), //hour
    'm+': v.getMinutes(), //minute
    's+': v.getSeconds(), //second
    'q+': Math.floor((v.getMonth() + 3) / 3), //quarter
    // "S" : v.getMilliseconds() //millisecond
  };

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (v.getFullYear() + '').substring(4 - RegExp.$1.length));
  }

  if (/(S+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      ('000' + v.getMilliseconds()).substring(('' + v.getMilliseconds()).length),
    );
  }

  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substring(('' + o[k]).length),
      );
    }
  }
  return format;
}

/*
     将String类型解析为Date类型.
     parseDate('2006-1') return new Date(2006,0)
     parseDate(' 2006-1 ') return new Date(2006,0)
     parseDate('2006-1-1') return new Date(2006,0,1)
     parseDate(' 2006-1-1 ') return new Date(2006,0,1)
     parseDate('2006-1-1 15:14:16') return new Date(2006,0,1,15,14,16)
     parseDate(' 2006-1-1 15:14:16 ') return new Date(2006,0,1,15,14,16);
     parseDate('2006-1-1 15:14:16.254') return new Date(2006,0,1,15,14,16,254)
     parseDate(' 2006-1-1 15:14:16.254 ') return new Date(2006,0,1,15,14,16,254)
     parseDate('不正确的格式') retrun null
     */
export function parseDate(str) {
  if (typeof str == 'string') {
    var results = str.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) *$/);
    if (!results && str.match(/^ *(\d{4})-(\d{1,2}) *$/)) {
      results = str.match(/^ *(\d{4})-(\d{1,2}) *$/);
      return new Date(parseInt(results[1], 10), parseInt(results[2], 10) - 1);
    }
    if (results && results.length > 3)
      return new Date(
        parseInt(results[1], 10),
        parseInt(results[2], 10) - 1,
        parseInt(results[3], 10),
      );
    results = str.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2}) *$/);
    if (results && results.length > 6)
      return new Date(
        parseInt(results[1], 10),
        parseInt(results[2], 10) - 1,
        parseInt(results[3], 10),
        parseInt(results[4], 10),
        parseInt(results[5], 10),
        parseInt(results[6], 10),
      );
    results = str.match(
      /^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2})\.(\d{1,5}) *$/,
    );
    if (results && results.length > 7)
      return new Date(
        parseInt(results[1], 10),
        parseInt(results[2], 10) - 1,
        parseInt(results[3], 10),
        parseInt(results[4], 10),
        parseInt(results[5], 10),
        parseInt(results[6], 10),
        parseInt(results[7], 10),
      );
  }
  return null;
}

//时间快速选择
/*
    obj:选择的时间
*/
export function quickDate(obj) {
  let startTime = '';
  let endTime = '';
  let now = new Date(),
    year = now.getFullYear(),
    mon = now.getMonth() + 1,
    day = now.getDate(),
    hours = now.getHours(),
    min = now.getMinutes(),
    sec = now.getSeconds(),
    nowY = null,
    nowYe = null,
    yearY = null,
    monY = null,
    dayY = null,
    nowD = null,
    nowDe = null,
    yearD = null,
    monD = null,
    dayD = null,
    nowM = null,
    nowMe = null,
    yearM = null,
    monM = null,
    dayM = null;
  switch (obj.value) {
    case 'all':
      startTime = '';
      endTime = '';
      break;
    case 'day':
      nowY = new Date().getTime();
      nowY = nowY - 86400000; //86400000是一天的毫秒数
      nowYe = new Date(nowY);
      yearY = nowYe.getFullYear();
      monY = nowYe.getMonth() + 1;
      dayY = nowYe.getDate();
      startTime = formatDate(`${yearY}-${monY}-${dayY} ${hours}:${min}:${sec}`);
      endTime = formatDate(`${year}-${mon}-${day} ${hours}:${min}:${sec}`);
      break;
    case 'today':
      startTime = formatDate(`${year}-${mon}-${day} 00:00:00`);
      endTime = formatDate(`${year}-${mon}-${day} ${hours}:${min}:${sec}`);
      break;
    case 'week':
      nowD = new Date().getTime();
      nowD = nowD - 86400000 * 7; //86400000是一天的毫秒数
      nowDe = new Date(nowD);
      yearD = nowDe.getFullYear();
      monD = nowDe.getMonth() + 1;
      dayD = nowDe.getDate();
      startTime = formatDate(`${yearD}-${monD}-${dayD} 00:00:00`);
      endTime = formatDate(`${year}-${mon}-${day} ${hours}:${min}:${sec}`);
      break;
    case 'month':
      nowM = new Date().getTime();
      nowM = nowM - 86400000 * 30; //86400000是一天的毫秒数
      nowMe = new Date(nowM);
      yearM = nowMe.getFullYear();
      monM = nowMe.getMonth() + 1;
      dayM = nowMe.getDate();
      startTime = formatDate(`${yearM}-${monM}-${dayM} 00:00:00`);
      endTime = formatDate(`${year}-${mon}-${day} ${hours}:${min}:${sec}`);
      break;
    case 'halfYear':
      endTime = formatDate(`${year}-${mon}-${day} ${hours}:${min}:${sec}`);
      if (mon > 6) {
        mon -= 6;
      } else {
        year -= 1;
        mon = 12 + mon - 6;
      }
      startTime = formatDate(`${year}-${mon}-${day} 00:00:00`);
      break;
    default:
      initSearchTime(obj);
      break;
  }
  return {
    startTime,
    endTime,
  };
}

//初始化检索时间alarm & retrieval
export function initSearchTime(obj) {
  let now = new Date(),
    year = now.getFullYear(),
    mon = now.getMonth() + 1,
    day = now.getDate(),
    hours = now.getHours(),
    min = now.getMinutes(),
    sec = now.getSeconds();
  if (mon == 1) {
    mon = 12;
    year = year - 1;
  }
  obj.startTime = this.formatDate(`${year}-${mon}-${day} 00:00:00`);
  obj.endTime = this.formatDate(`${year}-${mon}-${day} ${hours}:${min}:${sec}`);
}
/**
 * 判断年份是否为润年
 *
 * @param {Number} year
 */
function isLeapYear(year) {
  return year % 400 == 0 || (year % 4 == 0 && year % 100 != 0);
}
/**
 * 获取某一年份的某一月份的天数
 *
 * @param {Number} year
 * @param {Number} month
 */
function getMonthDays(year, month) {
  return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (isLeapYear(year) ? 29 : 28);
}
/**
 * 获取某年的某天是第几周
 * @param {Number} y
 * @param {Number} m
 * @param {Number} d
 * @returns {Number}
 */
export function getWeekNumber(date) {
  var now = new Date(date),
    year = now.getFullYear(),
    month = now.getMonth(),
    days = now.getDate();
  //那一天是那一年中的第多少天
  for (var i = 0; i < month; i++) {
    days += getMonthDays(year, i);
  }

  //那一年第一天是星期几
  var yearFirstDay = new Date(year, 0, 1).getDay() || 7;

  var week = null;
  if (yearFirstDay == 1) {
    week = Math.ceil(days / yearFirstDay);
  } else {
    days -= 7 - yearFirstDay + 1;
    week = Math.ceil(days / 7) + 1;
  }

  return week;
}

export function getUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 *
 * @param {*} totalData 获取到的所有的数据
 * @param {*} currentPage 当前的页码
 * @param {*} pageSize 当前的每页多少条
 * pageData 当前的分页分出的数据
 */
export function pagination(totalData, currentPage, pageSize) {
  let pageData = [];
  for (let i = 0, length = totalData.length; i < length; i++) {
    if (i < pageSize * currentPage && i >= pageSize * (currentPage - 1)) {
      pageData.push(totalData[i]);
    }
  }
  return pageData;
}

//代码雨
export function codeRain(flag, id, domWidth, domHeight) {
  let timer = null;
  function drap() {
    ctx.fillStyle = 'rgba(16,39,93,0.07)';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#0598c0';
    ctx.font = fontsize + 'px arial';
    for (var i = 0; i < drop.length; i++) {
      var text1 = string1[Math.floor(Math.random() * string1.length)];
      ctx.fillText(text1, i * fontsize, drop[i] * fontsize);
      drop[i]++;
      if (drop[i] * fontsize > c.height && Math.random() > 0.9) {
        //90%的几率掉落
        drop[i] = 0;
      }
    }
  }
  if (flag) {
    var c = document.getElementById(id);
    var ctx = c.getContext('2d');
    c.width = domWidth;
    c.height = domHeight;
    //				ctx.fillRect(0,0,100,100);
    //				a,b,c,d分别代表x方向偏移,y方向偏移,宽，高
    var string1 = 'abcdefghijklmnopqrstuvwxyz';
    string1.split('');
    var fontsize = 16;
    var columns = c.width / fontsize;
    var drop = [];
    for (var x = 0; x < columns; x++) {
      drop[x] = 0;
    }

    timer = setInterval(drap, 20);
  } else {
    clearInterval(timer);
    timer = null;
  }
}

/**
 * 数组对象去重
 * @param {*} list 目标去重数组
 * @param {*} target 以哪个字段去重
 * @returns 去重后的数组
 */
export function deduplication(list, target) {
  let hash = {};
  let array = [];
  array = list.reduceRight((item, next) => {
    hash[next[target]] ? '' : (hash[next[target]] = true && item.unshift(next));
    return item;
  }, []);
  return array;
}

//秒级时间转换为分秒格式
export function totalCostTimeFormat(val) {
  if (val > 59) {
    return `${Math.floor(val / 60)} 分${val % 60} 秒`;
  } else {
    return `${val} 秒`;
  }
}

/**
 * 一维数组转树状数组
 * arr: 要转换的一维数组
 * id: 唯一识别
 * pid: 父级唯一识别
 */
export function arrayToJson(arr, id, pid, children = 'children') {
  let tempArr = [];
  let tempObj = {};
  for (let i = 0, l = arr.length; i < l; i++) {
    tempObj[arr[i][id]] = arr[i];
  }
  for (let i = 0, l = arr.length; i < l; i++) {
    let key = tempObj[arr[i][pid]];

    if (key) {
      if (!key[children]) {
        key[children] = [];
        key[children].push(arr[i]);
      } else {
        key[children].push(arr[i]);
      }
    } else {
      tempArr.push(arr[i]);
    }
  }
  return tempArr;
}

export function jsonToArray(nodes, children = 'children') {
  let r = [];
  if (Array.isArray(nodes)) {
    for (let i = 0, l = nodes.length; i < l; i++) {
      r.push(nodes[i]);
      if (Array.isArray(nodes[i][children]) && nodes[i][children].length > 0)
        //将children递归的push到最外层的数组r里面
        r = r.concat(jsonToArray(nodes[i][children]));
      delete nodes[i][children];
    }
  }
  return r;
}
/**
 * 根据id找到树中的节点
 * @param {*} data 树的数组
 * @param {*} nodeId 需要找到的结点
 * @param {*} id 查询的字段名称
 * @param {*} children 树的子节点的字段名称
 */
export function getCurrentNode(data, nodeId, id = 'regionCode', children = 'children') {
  for (let i = 0; i < data.length; i++) {
    if (nodeId == data[i][id]) {
      return data[i];
    }
    if (data[i][children]) {
      const res = getCurrentNode(data[i].children, nodeId);
      if (res) {
        return res;
      }
    }
  }
}

/**
 * 获取 url参数
 */
export function getRegust(search) {
  let theRequest = new Object();
  if (search.indexOf('?') !== -1) {
    let str = search.substring(1);
    let strs = str.split('&');
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1]);
    }
  }
  // location.search = '';
  return theRequest;
}

/**
 * 文件流导出
 * @param {*} res 文件流返回结果
 * @param {*} filename 文件名称
 * @param {*} type 文件类型
 * @returns
 */
export function exportfile(res, filename = null, type = '') {
  return new Promise((reslove, reject) => {
    const resData = res.data;
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      try {
        const errJson = JSON.parse(fileReader.result); // 说明是普通对象数据，后台转换失败
        reject(errJson);
      } catch (err) {
        // 解析成对象失败，说明是正常的文件流
        reslove({
          code: 200,
        });
        const blob = new Blob([res.data], {
          type: type,
        });

        //获取heads中的filename文件名
        const temp = filename
          ? filename
          : res.headers['content-disposition'].split(';')[1].split('filename=')[1];
        const fileName = decodeURIComponent(temp);
        downloadFile(blob, fileName);
      }
    };
    fileReader.readAsText(resData);
  });
}

/**
 * 文件链接地址导出
 * @param {*} url 文件下载链接
 * @param {*} fileName 文件名称
 */
export async function transformBlob(url, fileName = null) {
  const response = await fetch(url, {
    mode: 'cors', //跨域
  }); // 内容转变成blob地址
  const blob = await response.blob();
  const _fileName = fileName ? fileName : url.split('/')[url.split('/').length - 1];
  // 下载文件
  downloadFile(blob, _fileName);
}

/**
 * 文件创建a链接下载
 * @param {*} blob
 * @param {*} fileName
 */
function downloadFile(blob, fileName) {
  const url = window.URL.createObjectURL(blob);
  let aLink = document.createElement('a');
  aLink.setAttribute('download', fileName);
  aLink.style.display = 'none';
  aLink.href = url;
  document.body.appendChild(aLink);
  aLink.click();
  document.body.removeChild(aLink);
  window.URL.revokeObjectURL(url);
}

export const emptyJSX = `
<div class="no-data">
    <img class="no-data-img" src=${() => import('@/assets/img/common/nodata.png')} />
    <div class='null-data-text'>暂无数据</div>
</div>
`;
export const emptyJSXImg = `
<div class="no-data">
    <img class="no-data-img" src=${() => import('@/assets/img/common/nodata-img.png')} />
    <div class='null-data-text'>暂无数据</div>
</div>
`;

//des解码
export const decryptDes = (ciphertext, key) => {
  const keyHex = CryptoJS.enc.Latin1.parse(key);
  // direct decrypt ciphertext
  const decrypted = CryptoJS.DES.decrypt(
    {
      ciphertext: CryptoJS.enc.Base64.parse(ciphertext),
    },
    keyHex,
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    },
  );
  return decrypted.toString(CryptoJS.enc.Utf8);
};

//des加密
export const encryptByDES = (message, key) => {
  var keyHex = CryptoJS.enc.Utf8.parse(key);
  var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};

/**
 * @description 根据iconid 匹配icon className
 * @param {*} shortNumber iconid
 */
const iconsDataList = iconsList.glyphs;
export const geticonClassName = (iconUrl) => {
  let font_class;
  for (let i = 0; i < iconsDataList.length; i++) {
    if (iconsDataList[i].icon_id == iconUrl) {
      font_class = iconsDataList[i].font_class;
      break;
    }
  }
  return font_class;
};
