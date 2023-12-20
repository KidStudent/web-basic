export default {
  login: '/qsdi-auth-service/oauth/token', //登录接口
  getUserInfo: '/qsdi-system-service/user/info/application', //获取用户信息
  updateToken: '/qsdi-auth-service/oauth/token?grant_type=refresh_token', //刷新用户token
  logout: '/qsdi-auth-service/token/logout', //登出
  getParamDataByKeys:
    '/qsdi-system-service/token/getParamDataByKeys?key=ISSHOW_COMPANY_INFORMATION', // 获取系统参数
  getParamDataByKeysS:
    '/qsdi-system-service/token/getParamDataByKeys?key=BASIC_DATA_STATISTICS_STYLE', // 获取系统参数（区分省厅，基线）
  getApplicationInfo: '/qsdi-system-service/token/getApplicationInfo', //获取系统配置信息
  queryUserList: '/qsdi-system-service/user/queryUserList', //根据组织机构列表获取用户列表
  queryAreaList: '/qsdi-system-service/system/region/queryForList', //查询全部行政区划的接口
  queryUserRegionData: '/qsdi-system-service/system/region/queryUserRegionData', //查询全部行政区划的接口

  getDictType: '/qsdi-system-service/dictType/list', //字典类型列表(不分页)queryUserRegionData
  queryByTypeKey: '/qsdi-system-service/dictData/queryByTypeKey', // 根据字典类型获取字典数据
  queryDataByKeyTypes: '/qsdi-system-service/dictData/queryDataByKeyTypes', // 根据字典类型批量获取字典数据
  getUserRoles: '/qsdi-system-service/user/getUserRoles', //获取角色下拉框数据
  getPersonalInfo: '/qsdi-system-service/user/personalInfo', //查询个人用户信息
  updatePersonalInfo: '/qsdi-system-service/user/updatePersonalInfo', //修改用户信息
  updatePersonalPsw: '/qsdi-system-service/user/updatePersonalPsw', //修改用户密码
  getOrgsTreeList: 'qsdi-system-service/system/org/orgsTree', //
  getSysApplicationInfo: '/qsdi-system-service/user/sysApplicationInfo',

  //第三方登录：乌市
  tokenWsUniportalCheck: '/qsdi-system-service/token/wsUniportalCheck', //?token={token} 统一门户token校验
  userWsInfo: '/qsdi-system-service/user/ws/info', //获取子系统用户信息
};
