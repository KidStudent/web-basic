<template>
  <error-content code="401" desc="授权已过期，请联系管理员" :src="src" />
</template>

<script>
  import error401 from '@/assets/img/error/error_401.png';
  import errorContent from './error-content.vue';
  export default {
    name: 'error_401',
    components: {
      errorContent,
    },
    data() {
      return {
        src: error401,
      };
    },
  };
</script>
