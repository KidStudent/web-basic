<template>
  <span class="avatar-container">
    <img :src="src" @error="handleError" :style="styles" alt="" />
  </span>
</template>

<script setup>
  import errorUrl from '@/assets/img/error/avatar.png';
  defineOptions({
    name: 'ui-avatar',
  });
  defineProps({
    src: {
      type: String,
    },
  });

  const styles = {
    'object-fit': 'cover',
  };

  function handleError(e) {
    let img = e.target;
    // img.onerror = null; //解绑onerror事件
    img.src = errorUrl;
    styles['object-fit'] = 'scale-down';
  }
</script>

<style lang="scss" scoped>
  .avatar-container {
    position: relative;
    display: inline-block;
    width: 32px;
    height: 32px;
    overflow: hidden;
    line-height: 32px;
    background: #0a3260;
    border: 1px solid #6ba6e3;
    border-radius: 50%;

    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
