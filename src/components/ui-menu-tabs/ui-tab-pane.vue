<template>
  <div
    class="ui-tab-pane"
    :class="active ? 'active' : ''"
    @click="tabClick"
    @contextmenu.prevent="openMenu"
    ref="uiTabPaneRef"
  >
    <slot name="label">
      <span class="ui-tab-label ellipsis" :title="label">{{ label }}</span>
    </slot>
    <i class="icon-font icon-dacha close" v-if="hasClosed" @click.stop="closeRouter" />
  </div>
</template>
<script setup>
  import { ref, inject, onMounted, getCurrentInstance, computed } from 'vue';
  defineOptions({
    name: 'ui-tab-pane',
  });

  const props = defineProps({
    label: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
    },
    closable: {
      type: Boolean,
    },
    /**
     * 存在组件标签页时会有此参数传入
     * componentName：'组件名称',
     * routeName: '此组件所在路由'
     */
    meta: {
      type: Object,
    },
  });

  const rootTabs = inject('rootTabs');
  const { proxy } = getCurrentInstance();
  const uiTabPaneRef = ref(null);
  const hasClosed = computed(() => props.closable || rootTabs.closable);
  const active = computed(() => {
    return rootTabs.tabsValue.value === props.name;
  });

  function tabClick() {
    rootTabs.tabsValue.value = props.name;
    rootTabs.emit('on-click', props.name, props.meta);
  }

  function closeRouter() {
    rootTabs.emit('on-tab-remove', props.name, props.meta);
  }

  function openMenu(even) {
    rootTabs.openMenu(props.name, even);
    rootTabs.emit('on-contextmenu', props.name, even);
  }

  onMounted(() => {
    rootTabs.scrollChildNodes.value.push(proxy.$el);
  });
</script>
<style lang="scss" scoped>
  .ui-tab-pane {
    @include font_color('tabPaneColor');

    position: relative;
    display: inline-block;
    height: 36px;
    padding: 0 20px;
    font-size: 14px;
    font-weight: 500;
    line-height: 36px;

    .ui-tab-label {
      display: inline-block;
      max-width: 120px;
      vertical-align: middle;
    }

    &:hover {
      @include background_color('tabPaneHoverBg');

      color: #fff;
    }

    &.active {
      @include background_color('tabPaneBgActive');
      @include font_color('tabPaneActive');
      // border-bottom: 1px solid #2b84e2;
      box-shadow: inset 0 -3px 0 0 #2c86f8;
    }

    .close {
      margin-left: 10px;
      font-size: 12px;
      transform: scale(0.7);
    }
  }
</style>
