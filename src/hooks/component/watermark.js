import { unref, shallowRef } from 'vue';
import { useEventListener } from '@/hooks/event/useEventListener';

export function useWatermark(appendEl) {
  // 绘制文字背景图
  function createBase64(str, attr) {
    const can = document.createElement('canvas');
    const width = 200;
    const height = 140;
    Object.assign(can, {
      width,
      height,
    });

    const cans = can.getContext('2d');
    if (cans) {
      cans.rotate((-20 * Math.PI) / 120);
      cans.font = attr ? attr.font : '20px Reggae One';
      cans.fillStyle = attr ? attr.fillStyle : 'rgba(0, 0, 0, 0.12)';
      cans.textAlign = 'left';
      cans.textBaseline = 'middle';
      cans.fillText(str, width / 20, height);
    }
    return can.toDataURL('image/png');
  }
  const id = 'watermark';
  const watermarkEl = shallowRef();

  // 绘制水印层
  const createWatermark = (str, attr) => {
    if (unref(watermarkEl)) {
      updateWatermark({
        str,
        attr,
      });
      return id;
    }
    const div = document.createElement('div');
    watermarkEl.value = div;
    div.id = id;
    div.style.pointerEvents = 'none';
    div.style.top = '0px';
    div.style.left = '0px';
    div.style.position = 'absolute';
    div.style.zIndex = '100000';
    const el = unref(appendEl);
    if (!el) return id;
    const { clientHeight: height, clientWidth: width } = el;
    updateWatermark({
      str,
      width,
      height,
      attr,
    });
    el.appendChild(div);
    return id;
  };

  // 页面随窗口调整更新水印
  function updateWatermark(options) {
    const el = unref(watermarkEl);
    if (!el) return;
    if (options.width !== 'undefined') {
      el.style.width = `${options.width}px`;
    }
    if (options.height !== 'undefined') {
      el.style.height = `${options.height}px`;
    }
    if (options.str !== 'undefined') {
      el.style.background = `url(${createBase64(options.str, options.attr)}) left top repeat`;
    }
  }

  const func = () => {
    const el = unref(appendEl);
    if (!el) return;
    const { clientHeight: height, clientWidth: width } = el;
    updateWatermark({
      height,
      width,
    });
  };

  let removeResizeFn = null;
  // 对外提供的设置水印方法
  function setWatermark(str, attr) {
    createWatermark(str, attr);
    const { removeEvent } = useEventListener({
      el: document.documentElement,
      name: 'resize',
      listener: func,
      wait: 80,
      isDebounce: false,
      autoRemove: false,
    });
    removeResizeFn = removeEvent;
  }

  // 清除水印
  const clear = () => {
    const domId = unref(watermarkEl);
    watermarkEl.value = undefined;
    const el = unref(appendEl);
    if (!el) return;
    domId && el.removeChild(domId);
    removeResizeFn();
  };

  return {
    setWatermark,
    clear,
  };
}
