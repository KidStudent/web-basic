export default {
  getMapConfig: '/json/mapConfig.json?t=' + Date.now(), ///json/HongHe-mapConfig.json 省厅云南省地图///json/mapConfig.json
  getMapStyle: '/json/mapStyle.json?t=' + Date.now(), //获取地图风格化样式
  dataMapPath: '/json/map-china-config/', // echarts数据地图json路径前缀
  getAreaPoiname: '/netposa/query/poiname',
  getSatelliteMap: '/json/satellite-map.json?t=' + Date.now(), //卫星地
  getCrossTrailMapData: '/json/map-crosstrail-config/crosstrail-map.json', //跨区轨迹地区坐标点
  getThirdpartMapData: '/json/map-icon-config/thirdpart-icon-list.json', //第三方图标信息
  //getEchartsMap: '/dataMapJson/532500.json', //获取云南省的地图(echarts数据地图)///json/echarts-main.json
};
