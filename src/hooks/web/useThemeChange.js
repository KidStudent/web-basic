import useCommon from '@/stores/modules/common';
import { watch } from 'vue';

export function themeChange(callback) {
  const commonStore = useCommon();
  watch(
    () => commonStore.themeType,
    (val) => {
      callback(val);
    },
  );
}
