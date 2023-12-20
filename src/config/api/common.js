export default {
  getSystemConfig: '/json/system-name-config/system-config.json?t=' + Date.now(), //获取系统管理配置
  getLocalConfig: '/local-config.json?t=' + Date.now(), //获取本地系统配置
  getCityAll: '/json/others/city.json?t=' + Date.now(), // 获取所有城市列表
  getAreaType: '/json/system-param-config/area-type-list.json?t=' + Date.now(), // 获取所有区域类型
  getMarkIconList: '/json/map-icon-config/mark-icon-list.json?t=' + Date.now(), //获取

  getDeviceList: '/ivdg-asset-app/device/queryDeviceList', //获取全部摄像头列表
  getMapSelectTreeList: '/ivdg-asset-app/deviceMap/conditionQuery', // 设备地图左侧树
  getMapSelectAllDevice: '/ivdg-asset-app/deviceMap/selectAllDevice', // 设备地图有权限设备
  getConditionQueryPageList: '/ivdg-asset-app/deviceMap/conditionQueryPageList', // 设备地图设备筛选
  getOrgsTreeNew: '/ivdg-asset-app/deviceMap/orgsTreeNew',
  getChildByOrgCode: '/ivdg-asset-app/deviceMap/getChildByOrgCode',
  getDeviceInfo: '/ivdg-asset-app/deviceMap/queryDeviceInfo',

  getLicenseInfo: '/qsdi-auth-service/license/getLicenseInfo', //获取授权证书
  getAuthorUrl: '/qsdi-system-service/token/getParamDataByKeys?key=AUTH_URL', // 获取授权跳转地址
  getAuthorNoticeDay: '/qsdi-system-service/token/getParamDataByKeys?key=AUTH_NOTICE', // 获取授权通知天数
  getOrgView: '/qsdi-system-service/system/org/view', //获取组织机构详情
  getDownloadCenterList: '/qsdi-system-service/downloadCenter/pageList', //获取下载文件列表
  delDownloadCenterList: '/qsdi-system-service/downloadCenter/remove', //删除下载文件
};
