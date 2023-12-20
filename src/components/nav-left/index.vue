<template>
  <div class="menu-list">
    <ui-menu :open-names="openNames" :active="activeRouter" :is-collapsed="isCollapsed">
      <template v-for="(item, index) in menuList" :key="index">
        <sub-menu
          class="sub-menu-first"
          v-if="item[menuProp.menuChildren] && item[menuProp.menuChildren].length > 0"
          :name="item[menuProp.menuName]"
          :title="item[menuProp.menuText]"
        >
          <template #title>
            <i class="iconfontconfigure" :class="`icon-${item[menuProp.menuIcon]}`" />
            <span class="inline vt-middle">{{ item[menuProp.menuText] }}</span>
            <div class="triangle" />
          </template>
          <template v-for="(itm, ind) in item[menuProp.menuChildren]" :key="ind">
            <sub-menu
              v-if="itm[menuProp.menuChildren] && itm[menuProp.menuChildren].length > 0"
              :name="itm[menuProp.menuName]"
              :title="itm[menuProp.menuText]"
            >
              <template #title>
                <span class="inline vt-middle">{{ itm[menuProp.menuText] }}</span>
              </template>
              <menu-item
                v-for="(row, i) in itm[menuProp.menuChildren]"
                :key="i"
                :name="row[menuProp.menuName]"
                @selectMenu="selectMenu"
              >
                <span class="inline vt-middle">{{ row[menuProp.menuText] }}</span>
              </menu-item>
            </sub-menu>
            <menu-item v-else :name="itm[menuProp.menuName]" @selectMenu="selectMenu">
              <span class="inline vt-middle">{{ itm[menuProp.menuText] }}</span>
            </menu-item>
          </template>
        </sub-menu>
        <menu-item
          v-else
          class="menu-first"
          :name="item[menuProp.menuName]"
          :key="index"
          :title="item[menuProp.menuText]"
          @selectMenu="selectMenu"
        >
          <i class="iconfontconfigure" :class="`icon-${item[menuProp.menuIcon]}`" />
          <span class="inline vt-middle">{{ item[menuProp.menuText] }}</span>
        </menu-item>
      </template>
    </ui-menu>
  </div>
</template>
<script setup>
  import { onMounted, reactive, ref, watch, watchEffect } from 'vue';
  import { useRoute } from 'vue-router';

  import SubMenu from '@/components/ui-menu/sub-menu.vue';
  import MenuItem from '@/components/ui-menu/menu-item.vue';
  import UiMenu from '@/components/ui-menu/ui-menu.vue';

  const props = defineProps({
    isCollapsed: {
      type: Boolean,
      default: false,
    },
    menuList: {
      type: Array,
      required: true,
    }, //菜单列表
    menuProp: {
      type: Object,
      default: () => {
        return {
          menuChildren: 'children',
          menuName: 'name',
          menuText: 'text',
          menuIcon: 'iconName',
        };
      },
    },
  });

  const emit = defineEmits(['selectMenu']);
  const route = useRoute();

  let openNames = reactive([]);
  let activeRouter = ref(null);

  function selectMenu(name) {
    emit('selectMenu', name);
  }
  function getPath() {
    activeRouter.value = route.name;
  }
  // 获取当前打开的菜单
  function getOpenNames() {
    let openNameList = route.path.split('/');
    // 去除首个空路由
    openNameList.splice(0, 1);
    openNames = openNameList;
  }

  onMounted(() => {
    getPath();
  });

  watch(
    () => route.name,
    () => {
      getPath();
    },
  );

  watchEffect(() => {
    if (props.isCollapsed) {
      openNames = [];
    } else {
      getOpenNames();
    }
  });
</script>
<style lang="scss" scoped>
  .menu-list {
    height: calc(100% - 60px);
    overflow-x: hidden;
    overflow-y: auto;

    &::-webkit-scrollbar {
      display: none;
    }

    > :deep(.menu) {
      > .menu-item {
        padding: 13px 0;
        justify-content: center;
        flex-direction: column;
      }
    }
  }

  .menu-first {
    position: relative;

    &.menu-item-active {
      &::before {
        @include background_color('menuFirstBeforeBg');

        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        content: '';
      }
    }
  }

  .sub-menu-first {
    .triangle {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 0;
      height: 0;
      border-top: 9px solid transparent;
      border-right: 9px solid #7893af;
    }

    &.sub-menu-active {
      > :deep(.sub-menu-title) {
        .triangle {
          @include border_right_color('subFirstTriangleBorder');
        }

        &::before {
          @include background_color('subFirstBeforeBg');

          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          content: '';
        }
      }
    }
  }
</style>
