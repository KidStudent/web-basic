import { getRegust } from '@/utils/common';
import ssoConfig from './sso-config';
import UseCommonStore from '@/stores/modules/common';

const ssoLogin = async () => {
  const params = getRegust(location.search);
  const commonStore = UseCommonStore();
  const distinguishVersion = commonStore.systemConfig.distinguishVersion;
  if (
    !distinguishVersion ||
    !ssoConfig[distinguishVersion] ||
    !ssoConfig[distinguishVersion].validateParams(params, ssoConfig[distinguishVersion].must)
  ) {
    return;
  }
  await ssoConfig[distinguishVersion].loginAsync(params);

  ssoConfig[distinguishVersion].must.forEach((row) => {
    delete params[row];
  });

  const newUrl = `${location.origin}${location.pathname}${location.hash}?${JSON.stringify(params)
    .replace(/["{}]/g, '')
    .replace(/:/g, '=')
    .replace(/,/g, '&')}`;

  return new Promise((resolve) => {
    setTimeout(() => {
      // 替换历史记录项
      window.location.replace(newUrl);
      resolve();
    }, 1000);
  });
};

export default ssoLogin;
