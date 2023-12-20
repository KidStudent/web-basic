import { ref, unref, watch } from 'vue';
import { useThrottleFn, useDebounceFn } from '@vueuse/core';

export function useEventListener({
  el = window,
  name,
  listener,
  options,
  autoRemove = true,
  isDebounce = true,
  wait = 0,
}) {
  let remove = {};
  const isAddRef = ref(false);

  if (el) {
    const element = ref(el);
    // 是否是防抖
    const handler = isDebounce ? useDebounceFn(listener, wait) : useThrottleFn(listener, wait);
    const realHandler = wait ? handler : listener;
    // 移出事件
    const removeEventListener = () => {
      isAddRef.value = true;
      el.removeEventListener(name, realHandler, options);
    };
    // 增加事件
    const addEventListener = (ele) => ele.addEventListener(name, realHandler, options);

    const removeWatch = watch(
      element,
      (value, oldValue, cleanUp) => {
        if (value) {
          !unref(isAddRef) && addEventListener(value);
          cleanUp(() => {
            autoRemove && removeEventListener(value);
          });
        }
      },
      {
        immediate: true,
      },
    );
    remove = () => {
      removeEventListener(element.value);
      removeWatch();
    };
  }
  return {
    removeEvent: remove,
  };
}
