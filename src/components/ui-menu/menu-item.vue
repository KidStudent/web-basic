<template>
  <div
    class="menu-item"
    :class="active ? 'menu-item-active' : ''"
    ref="menuItem"
    @click="selectMenu"
  >
    <slot />
  </div>
</template>
<script setup>
  import { inject, onMounted, reactive, onUnmounted, ref } from 'vue';
  import { getUUID } from '@/utils/common';

  defineOptions({
    name: 'menu-item',
  });

  const props = defineProps({
    name: {
      required: true,
      type: String,
    },
  });

  const emit = defineEmits(['selectMenu']);

  let active = ref(false);

  const rootMenu = inject('UiMenu');
  const subMenu = inject('SubMenu', null);
  const id = getUUID();

  function selectMenu() {
    emit('selectMenu', props.name);
  }

  function handleUpdateActiveName(name) {
    if (props.name === name) {
      if (subMenu) subMenu.handleUpdateActiveName(true);
      active.value = true;
    } else {
      active.value = false;
    }
  }

  function removeMenuItem() {
    const index = rootMenu.menuItemSlot.findIndex((row) => row.id === id);
    rootMenu.menuItemSlot.splice(index, 1);
  }

  onMounted(() => {
    const menuItem = reactive({
      id: id,
      name: props.name,
      handleUpdateActiveName,
    });
    rootMenu.menuItemSlot.push(menuItem);
  });

  onUnmounted(() => {
    removeMenuItem();
  });
</script>
<style lang="scss" scoped>
  .menu-item {
    display: flex;
    padding: 13px 20px;
    font-size: 14px;
    white-space: nowrap;
    cursor: pointer;
    align-items: center;

    &:hover {
      @include background_color('menuItemHoverBg');
      @include font_color('menuItemHoverColor');
    }

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: all 0.2s ease;
    }

    &.menu-item-active {
      @include background('menuItemActiveBg');

      color: #fff;
    }
  }
</style>
