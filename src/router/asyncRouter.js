const modules = import.meta.glob('../views/**/*.vue');
// 引入路由文件这种的公共路由
export function getAsyncRoutes(routes) {
  const res = [];
  // 定义路由中需要的自定名
  const keys = ['path', 'name', 'children', 'redirect', 'meta'];
  // 遍历路由数组去重组可用的路由
  routes.forEach((item) => {
    const newItem = {};
    newItem.component = modules[`../views${item.component}/index.vue`];
    for (const key in item) {
      if (keys.includes(key)) {
        newItem[key] = item[key];
      }
    }

    const hasChild = routes.findIndex((row) => row.parentId === item.id);
    // 若遍历的当前路由存在子路由，需要对子路由进行递归遍历
    if (hasChild !== -1) {
      let redirect = getRedirect(routes, item);
      newItem.redirect = {
        name: redirect,
      };
    }
    res.push(newItem);
  });
  // 动态添加重定向路由
  res.length &&
    res.push({
      path: '/',
      name: '/',
      redirect: {
        name: res[0].name,
      },
    });
  // 返回处理好且可用的路由数组
  return res;
}

function getRedirect(routes, route, redirect = '') {
  const redirectRoute = routes.find((row) => row.parentId === route.id);
  if (redirectRoute) {
    redirect = `${redirectRoute.name}`;
    return getRedirect(routes, redirectRoute, redirect);
  } else {
    return redirect;
  }
}
