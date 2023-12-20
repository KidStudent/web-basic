<template>
  <error-content code="500" desc="抱歉，服务器出了点小问题" :src="src" />
</template>

<script>
  import error404 from '@/assets/img/error/error_500.png';
  import errorContent from './error-content.vue';
  export default {
    name: 'error_500',
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
