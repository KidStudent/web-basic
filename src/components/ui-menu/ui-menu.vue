<template>
  <div class="menu" ref="menu" :class="computedClass">
    <slot />
  </div>
</template>
<script setup>
  import { computed, onMounted, reactive, watch, ref, nextTick, provide } from 'vue';
  import { useRoute } from 'vue-router';

  defineOptions({
    name: 'ui-menu',
  });

  const props = defineProps({
    openNames: {
      type: Array,
      default: () => {
        return [];
      },
    },
    active: {
      type: String,
    },
    isCollapsed: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: 'vertical',
    },
  });

  const menu = ref(null);
  const route = useRoute();

  let menuItemSlot = reactive([]);
  let subMenuSlot = reactive([]);
  let activeName = ref(null);
  const computedClass = computed(() => [
    props.isCollapsed ? 'collapsed-menu' : '',
    props.mode === 'horizontal' ? 'menu-horizontal' : '',
  ]);

  // 获取路由来激活某个菜单的active属性
  function changeActive() {
    if (!activeName.value) return;
    subMenuSlot.forEach((row) => {
      row.handleUpdateActiveName(false);
    });
    menuItemSlot.forEach((row) => {
      row.handleUpdateActiveName(activeName.value);
    });
  }
  // 更改每个子菜单的展开效果
  function changeOpen() {
    subMenuSlot.forEach((row) => {
      let index = props.openNames.findIndex((item) => item === row.name);
      if (index === -1) {
        row.isOpen = false;
        row.subMenuStyle = {
          display: 'none',
        };
      } else {
        row.isOpen = true;
        row.subMenuStyle = {};
      }
    });
  }
  function updateOpened() {
    changeOpen();
  }
  // 更改每个子菜单折叠收起状态
  function changeCollapsed() {
    subMenuSlot.forEach((row) => {
      row.isCollapsed = props.isCollapsed;
    });
  }

  provide(
    'UiMenu',
    reactive({
      subMenuSlot,
      menuItemSlot,
    }),
  );

  onMounted(() => {
    activeName.value = props.active;
    changeActive();
    changeCollapsed();
    updateOpened();
  });

  watch(
    () => route.name,
    () => {
      nextTick(() => {
        changeActive();
        changeCollapsed();
        updateOpened();
      });
    },
  );

  watch(
    () => props.active,
    (val) => {
      nextTick(() => {
        activeName.value = val;
        changeActive();
      });
    },
  );

  watch(
    () => props.openNames,
    () => {
      nextTick(() => {
        updateOpened();
      });
    },
  );

  watch(
    () => props.isCollapsed,
    () => {
      nextTick(() => {
        changeCollapsed();
      });
    },
  );
</script>
<style lang="scss" scoped>
  .collapsed-menu {
    > :deep(.menu-item) {
      span {
        max-width: 70px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    > :deep(.sub-menu) {
      > .sub-menu-title {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .sub-menu-title-icon {
          opacity: 0;
        }

        .vertical-icon {
          display: none;
        }
      }
    }
  }

  .menu {
    position: relative;
    display: block;
    padding: 0;
    margin: 0;
    font-size: 14px;
    color: #99a4af;
    list-style: none;
    outline: 0;
    transition: all 0.2s;
  }

  .menu-horizontal {
    display: flex;

    > :deep(.menu-item) {
      height: 53px;
      padding: 0 20px;
      line-height: 53px;
      color: rgb(255 255 255 / 70%);

      &.menu-item-active {
        @include background('menuItemActiveHorizontal');

        position: relative;
        color: #fff;

        &::after {
          @include background_color('menuItemActiveAfterHorizontal');

          position: absolute;
          bottom: 0;
          left: 0;
          display: inline-block;
          width: 100%;
          height: 4px;
          content: '';
        }
      }

      &:hover {
        @include background('menuItemActiveHoverHorizontal');

        color: #fff;
      }
    }

    > :deep(.sub-menu) {
      > .sub-menu-title {
        height: 53px;
        padding: 0 20px;
        line-height: 53px;
        color: rgb(255 255 255 / 70%);

        &:hover {
          color: #fff;
          background: linear-gradient(360deg, rgb(12 124 181 / 60%) 0%, rgb(6 87 129 / 60%) 100%);
        }

        .sub-menu-title-icon {
          display: none;
        }
      }

      &.sub-menu-active {
        > .sub-menu-title {
          position: relative;
          color: #fff;
          background: linear-gradient(360deg, #0c7cb5 0%, #065781 100%);

          &::after {
            position: absolute;
            bottom: 0;
            left: 0;
            display: inline-block;
            width: 100%;
            height: 4px;
            background-color: #29c9fb;
            content: '';
          }
        }
      }
    }
  }
</style>
