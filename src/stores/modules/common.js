import { defineStore } from 'pinia';
import common from '@/config/api/common';
import user from '@/config/api/user';
import map from '@/config/api/map';
import { arrayToJson, deepCopy } from '@/utils/common';
import axios from 'axios';
const cancelToken = axios.cancelToken;
export default defineStore('common', {
  namespaced: true,
  state: () => ({
    // 用于终止接口访问
    source: {
      token: null,
      cancel: null,
    },
    innerHeight: '', //屏幕可用高度用来自适应屏幕
    initialAreaList: [], //最初的一维数组辖区别表
    areaList: [], //树状辖区列表
    areaCancel: null, //取消重复请求区域接口
    defaultSelectedArea: '', //默认选中有权限的区域
    initialOrgList: [], //最初的一维数组组织机构列表
    organizationList: [], //组织结构列表
    organizationCancel: null, //取消重复请求组织机构接口
    defaultSelectedOrg: '', //默认选中有权限的组织机构
    orgDefaultkeys: [],
    cameraModuleDefaultKeys: [], //默认展开的列表
    cameraList: [], //摄像头列表
    cameraCancel: null, //取消重复请求摄像机接口
    sectionArea: [], //云南省地州列表
    moduleList: [], // 日志需要的 模块 list (路由对应的中文名啥的2333)
    systemConfig: {}, //系统名称
    localConfig: {}, //本地配置
    comprehensiveConfig: {}, //治理评价综合统计配置
    cityAll: [], //所有城市列表 用于省市县3级联动
    mapConfig: null, //地图配置
    mapCancel: null, //取消重复请求地图配置
    mapStyle: null, //地图风格化样式
    mapStyleCancel: null, //取消重复请求地图样式
    modulePermission: null, //模块权限列表

    isCollapsed: true, //菜单展开缩放
    tipsShow: true, // table的tips显示
    mapSelectTreeList: [],
    deviceMapCameraList: [],
    authorInfo: '', //授权信息
    themeType: '', //皮肤
  }),

  getters: {},
  actions: {
    setSource(source) {
      this.source = source;
    },
    setInnerHeight(innerHeight) {
      this.innerHeight = innerHeight;
    },
    async setAreaList() {
      if (this.areaList.length === 0) {
        if (!this.areaCancel) {
          try {
            let res = await axios.get(user.queryUserRegionData, {
              cancelToken: new cancelToken((c) => {
                this.areaCancel = c;
              }),
            });
            // 如果没有权限则disabled为true
            let arr = res.data.data.map((row) => {
              if (row.selectedStatus !== 1) {
                row.disabled = true;
              } else {
                row.disabled = false;
              }
              return row;
            });
            // 存储原始一维数组
            this.initialAreaList = arr;
            // 把一维数组处理为树状结构数组
            let areaList = arrayToJson(JSON.parse(JSON.stringify(arr)), 'regionCode', 'parentCode');
            this.areaList = areaList;
            this.areaCancel = null;
            if (areaList.length > 0) {
              this.cameraModuleDefaultKeys = [areaList[0].regionCode];
              // 寻找有权限的最高级设为默认行政区划
              let node,
                list = [...areaList];
              while ((node = list.shift())) {
                if (!node.disabled) {
                  this.defaultSelectedArea = node;
                  return;
                }
                node.children && list.unshift(...node.children);
              }
            }
          } catch (err) {
            console.error(err);
            this.areaCancel = null;
          }
        } else {
          this.areaCancel('重复请求区域列表');
        }
      }
    },
    removeAreaList() {
      this.areaList.length = 0;
    },
    async setOrganizationList(datascopeVoList) {
      if (this.organizationList.length === 0) {
        if (!this.organizationCancel) {
          try {
            datascopeVoList = datascopeVoList.sort((a, b) => a.id - b.id);
            // 如果没有权限则disabled为true
            let arr = datascopeVoList.map((row) => {
              row.disabled = row.selectedStatus !== 1;
              if (!this.defaultSelectedOrg && row.selectedStatus === 1) {
                this.defaultSelectedOrg = row;
                this.orgDefaultKeys = [row.orgCode];
              }
              return row;
            });
            // 存储原始一维数组
            this.initialOrgList = deepCopy(arr);
            // 把一维数组处理为树状结构数组
            let orgList = arrayToJson(deepCopy(arr), 'id', 'parentId');
            this.organizationList = orgList;
            this.organizationCancel = null;
            // if(orgList.length > 0){
            //     commit('setDefaultSelectedOrg', orgList[0]);
            //     commit('setOrgDefaultKeys', [orgList[0].orgCode]);
            // }
          } catch (err) {
            this.organizationCancel = null;
            console.log(err);
          }
        } else {
          this.organizationCancel('重复请求组织机构列表');
        }
      }
    },
    removeOrganizationList() {
      this.organizationList.length = 0;
    },
    async setCameraList(sbgnlxs = []) {
      if (this.cameraList.length === 0) {
        if (!this.cameraCancel) {
          try {
            let res = await axios.post(common.getDeviceList, {
              cancelToken: new cancelToken((c) => {
                this.cameraCancel = c;
              }),
              sbgnlxs: sbgnlxs,
            });
            this.cameraList = res.data.data;
            this.cameraCancel = null;
          } catch (err) {
            this.cameraCancel = null;
            console.log(err);
          }
        } else {
          this.cameraCancel('重复请求摄像头列表');
        }
      }
    },
    async getDeviceMapCameraList() {
      if (this.deviceMapCameraList.length === 0) {
        try {
          let res = await axios.post(common.getMapSelectAllDevice, {});
          this.deviceMapCameraList = res.data;
        } catch (err) {
          this.deviceMapCameraList = null;
          console.log(err);
        }
      }
    },
    removeCameraList() {
      this.cameraList.length = 0;
    },
    async setSectionArea() {
      if (this.sectionArea.length === 0) {
        try {
          let res = await axios.get(common.getSectionArea);
          this.sectionArea = res.data.data;
        } catch (err) {
          console.log(err);
        }
      }
    },
    removeSectionArea() {
      this.sectionArea.length = 0;
    },
    async setModuleList() {
      if (this.moduleList.length === 0) {
        try {
          let res = await axios.get(common.getModuleList);
          this.moduleList = res.data.data;
        } catch (err) {
          console.log(err);
        }
      }
    },
    async setSystemConfig() {
      try {
        const config = await axios.get(common.getSystemConfig);
        this.comprehensiveConfig = config.data.comprehensiveConfig;
        const res = await axios.get(user.getApplicationInfo, {
          params: { applicationCode: this.localConfig.ApplicationCode },
        });
        if (!res.data) {
          throw Error('未能获取到系统配置信息！');
        }
        const systemConfig = res.data.data[0];
        const { data } = await axios.get(user.getParamDataByKeys);
        if (!!data.data && !!data.data.paramValue) {
          const showLogo = data.data.paramValue === '1' ? true : false;
          systemConfig.showLogo = showLogo;
        }
        document.title = systemConfig.applicationName;
        const STATISTICS_STYLE = await axios.get(user.getParamDataByKeysS);
        if (!!STATISTICS_STYLE.data.data && !!STATISTICS_STYLE.data.data.paramValue) {
          // 基线：1，省厅：2
          systemConfig.distinguishVersion = STATISTICS_STYLE.data.data.paramValue || '1';
          // systemConfig.distinguishVersion = '2'
        } else {
          systemConfig.distinguishVersion = '1';
        }
        this.systemConfig = systemConfig;
      } catch (err) {
        console.error(err);
      }
    },
    async setLocalConfig() {
      try {
        const config = await axios.get(common.getLocalConfig);
        this.localConfig = config.data;
        window.sessionStorage.setItem('localConfig', JSON.stringify(this.localConfig));
      } catch (err) {
        console.log(err);
      }
    },

    // 设置授权信息
    setAuthor(authorInfo) {
      this.authorInfo = authorInfo;
    },
    getAuthor() {
      return new Promise((resolve, reject) => {
        axios.get(common.getAuthorUrl).then((resUrl) => {
          if (resUrl.data.data) {
            window.sessionStorage.setItem('authorUrl', resUrl.data.data.paramValue);
          } else {
            window.sessionStorage.setItem('authorUrl', window.location.host + '/404');
          }
          axios
            .get(common.getLicenseInfo, {
              params: {
                applicationCode: this.localConfig.ApplicationCode,
              },
            })
            .then((res) => {
              window.sessionStorage.setItem('authorInfo', JSON.stringify(res.data.data));
              this.authorInfo = res.data.data;
              resolve(true);
            })
            .catch(() => {
              reject(window.sessionStorage.getItem('authorUrl'));
            });
        });
      });
    },

    async setCityAll() {
      if (Object.keys(this.cityAll).length === 0) {
        try {
          let res = await axios.get(common.getCityAll);
          this.setCityAll = res.data.cityAll;
        } catch (err) {
          console.error(err);
        }
      }
    },
    async setMapConfig() {
      if (!this.mapConfig) {
        if (!this.mapCancel) {
          try {
            let res = await axios.get(map.getMapConfig, {
              cancelToken: new cancelToken((c) => {
                this.mapCancel = c;
              }),
            });
            this.mapConfig = res.data;
            this.mapCancel = null;
          } catch (err) {
            this.mapCancel = null;
            console.error(err);
          }
        } else {
          this.mapCancel('重复请求地图接口');
        }
      }
    },
    async setMapStyle() {
      if (!this.mapStyle) {
        if (!this.mapStyleCancel) {
          try {
            let res = await axios.get(map.getMapStyle, {
              cancelToken: new cancelToken((c) => {
                this.mapStyleCancel = c;
              }),
            });
            this.mapStyle = res.data;
            this.mapStyleCancel = null;
          } catch (err) {
            this.mapStyleCancel = null;
            console.error(err);
          }
        } else {
          this.mapStyleCancel('重复请求地图接口');
        }
      }
    },
    //模块权限
    setModulePermission(Permission) {
      this.modulePermission = Permission;
    },

    setIsCollapsed(isCollapsed) {
      this.isCollapsed = isCollapsed;
    },
    setTipsShow(tipsShow) {
      this.tipsShow = tipsShow;
    },
    setThemeType(type) {
      this.themeType = type;
    },
  },
});
