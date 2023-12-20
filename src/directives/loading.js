/**(还未完成)
 * loading + no-data处理
 * @param {loading} 例如：v-loading = "{ loading: true }" loading展示
 * @param {tableData} 例如：v-loading = "{ tableData: [] }" 显示nodata图片
 * @param {tableData} 例如：v-loading = "{ loading: rankLoading, tableData: rankData, type: 'img'}" 显示nodata-img图片 适用于列表为图片场景
 */
import Loading from '@/components/loading/index.vue';
import { emptyJSX, emptyJSXImg } from '@/utils/common';
import { createApp } from 'vue';
export const loadingDirective = {
  mounted(el, binding) {
    const div = document.createElement('div');
    const mask = createApp(Loading).mount(div);
    el.mask = mask;
    // 插入到目标元素
    insertDom(el, mask.$el);
    if (binding.value.tableData) {
      el.insertAdjacentHTML('beforeEnd', binding.value.type === 'img' ? emptyJSXImg : emptyJSX);
      madeNodata(el, binding);
    }
    toggleLoading(el, binding);
  },
  update(el, binding) {
    !!binding.value.tableData && madeNodata(el, binding);
    toggleLoading(el, binding);
  },
};
const insertDom = (parent, el) => {
  parent.appendChild(el);
  parent.style.position = 'relative';
};
const toggleLoading = (el, binding) => {
  if (binding.value.loading) {
    el.mask.$el.style.display = 'block';
  } else {
    el.mask.$el.style.display = 'none';
  }
};
const madeNodata = (el, binding) => {
  let node = el.children;
  if (!node || !node.length) return;
  const noData = Array.from(node).find((row) => row.className === 'no-data');
  if (!noData) return;
  if (binding.value.tableData.length === 0) {
    noData.style.display = 'flex';
  } else {
    noData.style.display = 'none';
  }
};
