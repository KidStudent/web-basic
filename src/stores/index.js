import { createPinia } from 'pinia';
import UseCommonStore from './modules/common';

const store = createPinia();
export function setupStore(app) {
  app.use(store);
}

export async function initAppConfigStore() {
  const commonStore = UseCommonStore();
  await commonStore.setLocalConfig();
}

export { store };
