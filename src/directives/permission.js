/**
 * 全局权限处理指令 用来控制操作按钮显示隐藏
 * 获取用户信息时返回一个权限列表permissions
 * 根据指令传入参数可以进行判断菜单列表中是否有该接口权限
 * 指令传入参数分别为
 * route：string
 * 接口所在菜单路由 必传 route必传是因为不同路由可能调用相同接口 但是在不同页面可能有不同权限
 * permission：权限标识 必传
 * mutually: 是否互斥 可传 此参数用来控制如有有权限不显示互斥 如果没权限则显示
 * 例：如果有编辑权限则显示编辑按钮如果没有编辑权限则显示查看按钮 因为查看权限是不需要赋予的
 */
import UsePermission from '@/stores/modules/permission';
export const permissionDirective = {
  mounted(el, binding) {
    if (binding.value) {
      !hasAuth(binding.value) && el.parentNode.removeChild(el);
    } else {
      throw new Error(
        "need permission! Like v-permission=\"{route: 'login', permission: 'login-api'}\"",
      );
    }
  },
};

function hasAuth(value) {
  const permissionStore = UsePermission();
  let isExist = false;
  let buttonpermsStr = permissionStore.permissions;
  if (buttonpermsStr === undefined || buttonpermsStr === null) {
    return false;
  }
  let hasPermission = buttonpermsStr.includes(`${value.route}-${value.permission}`);
  if (hasPermission && !value.mutually) {
    isExist = true;
  } else if (value.mutually && !hasPermission) {
    isExist = true;
  }
  return isExist;
}
