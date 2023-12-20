let curIP = window.location.hostname;
// 这里来判断是本地环境还是线上
if (curIP === 'localhost' || curIP === '127.0.0.1') {
  curIP = '192.168.1.116';
}
export default {
  //全局的websoket(新增)
  webSocketGlobal: 'ws://' + curIP + '/iVDGWebsocket/websocket/',
};
