<template>
  <div class="sub-menu" :class="[isOpen ? 'menu-opened' : '', active ? 'sub-menu-active' : '']">
    <div class="sub-menu-title" @mouseenter="mouseenter" @mouseleave="mouseleave">
      <slot name="title" />
      <i class="icon-font icon-xialazhankai vertical-icon" />
    </div>
    <div
      class="menu menu-vertical"
      ref="menuVertical"
      :style="style.verticalStyle"
      :id="id"
      @mouseenter="mouseenter"
      @mouseleave="mouseleave"
    >
      <div class="menu-vertical-box">
        <slot />
      </div>
    </div>
  </div>
</template>
<script setup>
  import { onMounted, reactive, inject, ref, getCurrentInstance, provide, onUnmounted } from 'vue';

  import { getUUID } from '@/utils/common';

  defineOptions({
    name: 'sub-menu',
  });

  const props = defineProps({
    name: {
      type: String,
      required: true,
    },
  });

  provide(
    'SubMenu',
    reactive({
      name: props.name,
      handleUpdateActiveName,
    }),
  );

  const SubMenu = inject('SubMenu', null);
  const rootMenu = inject('UiMenu');

  const { proxy } = getCurrentInstance();

  const style = reactive({ subMenuStyle: {}, verticalStyle: {} });
  const isOpen = ref(false);
  let active = ref(false);
  const isCollapsed = ref(true);
  let isShow = ref(false);
  const menuVertical = ref(null);
  const id = getUUID();

  /**
   * 计算三级菜单距离顶部的距离
   */
  function getVerticalStyle() {
    /**
     * 如果父级是一个二级菜单SubMenu
     * left = 当前二级菜单的宽度
     * top = 0
     * 如果父级是一个UiMenu
     * left = 当前二级菜单距离左侧的距离 + 当前二级菜单的宽度
     * top = 当前二级菜单距离顶部的距离
     */
    if (SubMenu) {
      style.verticalStyle = {
        left: proxy.$el.offsetWidth + 'px',
        top: 0,
        display: isShow.value ? 'block' : 'none',
      };
    } else {
      style.verticalStyle = {
        left: proxy.$el.getBoundingClientRect().left + proxy.$el.offsetWidth + 'px',
        top: proxy.$el.getBoundingClientRect().top + 'px',
        display: isShow.value ? 'block' : 'none',
      };
    }
  }

  function mouseenter() {
    if (!isCollapsed.value) return;
    isShow.value = true;
    getVerticalStyle();
  }

  function mouseleave() {
    if (!isCollapsed.value) return;
    isShow.value = false;
    getVerticalStyle();
  }

  // 更新当前submenu激活状态以及父级submenu激活状态
  function handleUpdateActiveName(status) {
    if (SubMenu) SubMenu.handleUpdateActiveName(status);
    active.value = status;
  }

  // 把三级菜单放入body中 防止样式被父级影响
  function createdIntoBody() {
    getVerticalStyle();
    if (!SubMenu) {
      const body = document.querySelector('body');
      if (body.append) {
        body.append(menuVertical.value);
      } else {
        body.appendChild(menuVertical.value);
      }
    }
  }

  function removeSubMenu() {
    const index = rootMenu.subMenuSlot.findIndex((row) => row.id === id);
    rootMenu.subMenuSlot.splice(index, 1);
    // 移除创建到body中的菜单
    const menuVertical = document.getElementById(id);
    menuVertical.parentNode.removeChild(menuVertical);
  }

  onMounted(() => {
    createdIntoBody();
    const subMenu = reactive({
      id: id,
      name: props.name,
      handleUpdateActiveName,
    });
    rootMenu.subMenuSlot.push(subMenu);
  });

  onUnmounted(() => {
    removeSubMenu();
  });
</script>
<style lang="scss" scoped>
  .sub-menu {
    position: relative;

    .menu {
      > :deep(.menu-item) {
        height: 40px;
      }

      :deep(.menu-item) {
        padding-left: 60px;
      }

      > .sub-menu {
        .sub-menu-title {
          display: flex;
          height: 40px;
          padding-left: 60px;
          align-items: center;
        }

        :deep(.menu-item) {
          padding-left: 70px;
        }
      }
    }

    &.menu-opened {
      > .sub-menu-title {
        .sub-menu-title-icon {
          transform: translateY(-50%) scale(0.5) rotateZ(-180deg);
        }
      }
    }

    &.sub-menu-active {
      > .sub-menu-title {
        @include background('subMenuActiveBg');

        color: #fff;
      }
    }

    .sub-menu-title {
      position: relative;
      z-index: 1;
      padding: 13px 20px;
      font-size: 14px;
      text-align: left;
      white-space: nowrap;
      cursor: pointer;
      transition: all 0.2s ease-in-out;

      &:hover {
        @include background_color('subMenuTitleHoverBg');

        color: #fff;
      }

      .sub-menu-title-icon {
        position: absolute;
        top: 50%;
        right: 24px;
        font-size: 12px;
        opacity: 1;
        transform: translateY(-50%) scale(0.5);
        transition: all 0.2s ease-in-out;
      }

      .vertical-icon {
        position: absolute;
        top: 50%;
        right: 24px;
        font-size: 12px;
        opacity: 1;
        transform: translateY(-50%) scale(0.5) rotateZ(-90deg);
        transition: all 0.2s ease-in-out;
      }

      span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .menu-vertical {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1999;
    display: block;

    .menu-vertical-box {
      @include background('menuBoxBgVertical');
      @include shadow('menuShadowVertical');
      @include font_color('menuBoxColorVertical');
    }

    :deep(.menu-item) {
      width: 160px;
      padding: 10px 20px !important;

      &:hover {
        @include font_color('menuItemHoverColorVertical');
        @include background_color('menuItemHoverBgVertical');
      }

      &.menu-item-active {
        @include font_color('menuItemActiveColorVertical');
        @include background('menuItemActiveBgVertical');
      }
    }

    .sub-menu {
      .sub-menu-title {
        @include background_color('subMenuTitleBgVertical');

        padding: 10px 20px !important;

        &:hover {
          @include font_color('menuItemHoverColorVertical');
          @include background('menuItemHoverBgVertical');
        }
      }

      &.sub-menu-active {
        > .sub-menu-title {
          @include font_color('subMenuActiveColorVertical');
          @include background('subMenuActiveBgVertical');
        }
      }
    }
  }
</style>
