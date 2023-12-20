import { defineStore } from 'pinia';
import websocket from '@/config/api/websocket';
export default defineStore('websocket', {
  namespaced: true,
  state: () => ({
    websock: null,
    logOutFlag: false, // websocket单点登陆退出标志
    newAccessPerson: {}, //新增身份
    alarmMessage: {}, // 布防预警消息提示
    refreshNotice: '', // 通知数量刷新
    specialAlarm: {}, // 特殊人群管控预警弹窗
    unregisterAlarm: {}, // 实口管控预警弹窗
    uploadAreaTip: {}, // 实口管控--上传成功or失败
  }),
  getters: {},
  actions: {
    startWebsock() {
      const token = window.sessionStorage.getItem('token');
      const wsurl = websocket.webSocketGlobal + token;
      this.websock = new WebSocket(wsurl);
      this.websock.onopen = function () {
        console.log('WebSocket全局连接成功', this.websock.readyState);
      };
      this.websock.onerror = function () {
        console.log('WebSocket全局连接失败');
      };
      this.websock.onmessage = function (e) {
        const data = JSON.parse(e.data);
        if (!data.resultCode) {
          return;
        }
        // 账号在别处登陆20029，退出 / token已经失效20024,要退出
        if (data.resultCode === 20029 || data.resultCode === 20024) {
          //Message.warning({content:data.msg,duration:8});
          console.log('token失效立刻断掉websoket');
          this.removeWebsocket();
          this.logOut = true;
          return;
        }
        // 刷新通知数量-saveRecord为true，更新数量
        if (data.data.saveRecord) {
          this.refreshNotice = Math.random();
        }
        let refreshData = null;
        switch (data.data.msgType) {
          // 数据地图-新增身份
          case 'newAccessPerson':
            this.newAccessPerson = data.data.data;
            break;
          // 全局预警消息报警
          case 'alarm':
            if (data.data.pop) {
              this.alarmMessage = data.data.data;
            }
            break;
          // 特殊人群管控预警报警
          case 'specialWarning':
            if (data.data.pop) {
              this.specialAlarm = data.data.data;
            }
            break;
          // 实口管控预警报警
          case 'unregisterKeyPerson':
            this.unregisterAlarm = data.data.data;
            break;
          // 实口管控上传成功/失败
          case 'uploadCustomAreaPerson':
            refreshData = {
              flag: Math.random(),
              data: data.data.data,
            };
            this.uploadAreaTip = refreshData;
            break;
          default:
        }
      };
      this.websock.onclose = () => {};
      // 心跳包，30s左右无数据浏览器会断开连接Heartbeat
      // setInterval(function () {
      //     this.websock.send(JSON.stringify({
      //     'heart': true
      //     }))
      // }, 30000)
    },
    removeWebsocket() {
      if (this.websock) {
        this.websock.close();
        this.websock = null;
      }
    },
    setWebsock(websock) {
      this.websock = websock;
    },
    setLogOutFlag(logOutFlag) {
      this.logOutFlag = logOutFlag;
    },
    setNewAccessPerson(newAccessPerson) {
      this.newAccessPerson = newAccessPerson;
    },
    setAlarmMessage(alarmMessage) {
      this.alarmMessage = alarmMessage;
    },
    setNoticeFlag(refreshNotice) {
      this.refreshNotice = refreshNotice;
    },
    setSpecialAlarm(specialAlarm) {
      this.specialAlarm = specialAlarm;
    },
    setUnregisterAlarm(unregisterAlarm) {
      this.unregisterAlarm = unregisterAlarm;
    },
    setUploadAreaTip(uploadAreaTip) {
      this.uploadAreaTip = uploadAreaTip;
    },
  },
});
