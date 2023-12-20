<template>
  <error-content code="404" desc="抱歉,您访问的页面不存在" :src="src" />
</template>

<script>
  import error404 from '@/assets/img/error/error_404.png';
  import errorContent from './error-content.vue';
  export default {
    name: 'error_404',
    components: {
      errorContent,
    },
    data() {
      return {
        src: error404,
      };
    },
  };
</script>
