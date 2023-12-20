<template>
  <div class="ui-tabs">
    <span class="option slider-left pointer" @click="scrollLeft">
      <i class="icon-font icon-zuojiantou" />
    </span>
    <span class="option slider-right pointer" @click="scrollRight">
      <i class="icon-font icon-youjiantou" />
    </span>
    <div class="ui-tabs-contanier">
      <div class="ui-tabs-view" ref="uiTabsViewRef">
        <div class="ui-tabs-scroll" ref="uiTabsScrollRef" :style="styles">
          <slot />
        </div>
      </div>
      <div
        class="tab-menu-contextmenu"
        v-show="contextmenuShow"
        ref="contextmenuRef"
        :style="contextmenuStyles"
      >
        <slot name="contextmenu" />
      </div>
    </div>
  </div>
</template>
<script setup>
  import { ref, provide, getCurrentInstance, watch, nextTick, onMounted } from 'vue';
  defineOptions({
    name: 'ui-tabs',
  });

  const props = defineProps({
    value: {
      type: String,
      default: '',
    },
    closable: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['on-click', 'on-tab-remove', 'on-contextmenu', 'update:modelValue']);
  const { proxy } = getCurrentInstance();

  let tabsValue = ref(null);
  let contextmenuShow = ref(false);
  let contextmenuStyles = ref({});
  let styles = ref({});
  let translateX = ref(0);
  let scrollChildNodes = ref([]);
  const uiTabsViewRef = ref(null);
  const contextmenuRef = ref(null);
  const uiTabsScrollRef = ref(null);

  function scrollLeft() {
    const bool = translateX.value >= uiTabsViewRef.value.clientWidth;
    if (bool) {
      translateX.value += uiTabsViewRef.value.clientWidth;
      styles.value = {
        transform: `translateX(${translateX.value}px)`,
      };
    } else {
      if (translateX.value === 0) {
        proxy.$Message.warning('已经滑到尽头了');
      } else {
        translateX.value = 0;
        styles.value = {};
      }
    }
  }

  function scrollRight() {
    /**
     * 1.滑动距离translateX + 可视窗口宽度 uiTabsView clientWidth
     * 2.滑块总宽度 uiTabsScroll offsetWidth
     * 如果2 > 1 说明还可以滑动 否则已经滑动到尽头
     */
    const bool =
      -translateX.value + uiTabsViewRef.value.clientWidth < uiTabsScrollRef.value.offsetWidth;
    if (bool) {
      /**
       * 1.可滑动距离 scrollDistance
       * 2.可视窗口距离 uiTabsView clientWidth
       * 如果 1 > 2 则滑动整个可视窗口的距离 否则滑动可滑动距离
       */
      const scrollDistance =
        uiTabsScrollRef.value.offsetWidth - (-translateX.value + uiTabsViewRef.value.clientWidth);
      if (scrollDistance >= uiTabsViewRef.value.clientWidth) {
        translateX.value -= uiTabsViewRef.value.clientWidth;
      } else {
        translateX.value -= scrollDistance;
      }
      styles.value = {
        transform: `translateX(${translateX.value}px)`,
      };
    } else {
      proxy.$Message.warning('已经滑到尽头了');
    }
  }

  function getActiveDom() {
    let activeDom = null;
    scrollChildNodes.value.forEach((row) => {
      row.classList.forEach((rw) => {
        if (rw === 'active') {
          activeDom = row;
        }
      });
    });
    return activeDom;
  }

  function scrollView() {
    const activeDom = getActiveDom();
    if (!activeDom) return;
    const leftDistance = activeDom.offsetLeft;
    const viewWidth = uiTabsViewRef.value.offsetWidth;
    if (leftDistance + translateX.value < 0) {
      translateX.value = -leftDistance;
    } else if (leftDistance + translateX.value >= viewWidth) {
      const scrollDistance = uiTabsScrollRef.value.offsetWidth - (leftDistance + viewWidth);
      if (scrollDistance > 0) {
        translateX.value = leftDistance;
      } else {
        translateX.value = -(uiTabsScrollRef.value.offsetWidth - viewWidth);
      }
    }
    styles.value = {
      transform: `translateX(${translateX.value}px)`,
    };
  }

  function openMenu({ e }) {
    const x = e.clientX;
    const y = e.clientY;
    contextmenuStyles.value = {
      top: y + 'px',
      left: x + 'px',
    };
    contextmenuShow.value = true;
  }

  function closeMenu() {
    contextmenuShow.value = false;
  }

  // 把右击菜单放入body中 防止样式被父级影响
  function createdIntoBody() {
    const body = document.querySelector('body');
    if (body.append) {
      body.append(contextmenuRef.value);
    } else {
      body.appendChild(contextmenuRef.value);
    }
  }

  provide('rootTabs', {
    emit,
    scrollChildNodes,
    tabsValue,
    openMenu,
    closable: props.closable,
  });

  watch(
    () => props.value,
    (val) => {
      nextTick(() => {
        scrollView();
      });
      tabsValue.value = val;
    },
    {
      immediate: true,
    },
  );

  watch(
    () => contextmenuShow.value,
    (val) => {
      if (val) {
        document.body.addEventListener('click', closeMenu);
      } else {
        document.body.removeEventListener('click', closeMenu);
      }
    },
  );

  onMounted(() => {
    createdIntoBody();
  });
</script>
<style lang="scss" scoped>
  .ui-tabs {
    position: relative;
    height: 36px;
    padding: 0 36px;
    line-height: 36px;
    color: #768192;

    .option {
      position: absolute;
      display: flex;
      width: 36px;
      height: 36px;
      align-items: center;
      justify-content: center;

      &:hover {
        @include background_color('tabOptionHoverBg');
        @include font_color('tabOptionHoverColor');
      }

      &.slider-left {
        @include border_color('tabSliderBorder');

        left: 0;
        border-right: 1px solid;
      }

      &.slider-right {
        @include border_color('tabSliderBorder');

        right: 0;
        border-left: 1px solid;
      }

      i {
        font-size: 12px;
      }
    }

    .ui-tabs-contanier {
      position: relative;

      .ui-tabs-view {
        position: relative;
        overflow: hidden;
        white-space: nowrap;

        .ui-tabs-scroll {
          position: relative;
          float: left;
          padding-left: 0;
          margin: 0;
          transition: transform 0.5s ease-in-out;
        }
      }
    }
  }

  .tab-menu-contextmenu {
    position: fixed;
    z-index: 999;
    width: auto;
    max-height: 200px;
    padding: 5px 0;
    margin: 5px 0;
    overflow: auto;
    background-color: #041129;
    border-radius: 4px;
    box-shadow: 0 1px 6px rgb(0 0 0 / 20%);
    box-sizing: border-box;
  }
</style>
