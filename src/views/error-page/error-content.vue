<template>
  <div class="error-page">
    <div class="content-con">
      <img :src="src" />
      <div class="text-con">
        {{ desc }}
      </div>
      <back-btn-group class="back-btn-group" />
    </div>
  </div>
</template>

<script>
  import './error.scss';
  import backBtnGroup from './back-btn-group.vue';
  export default {
    name: 'error_content',
    components: {
      backBtnGroup,
    },
    props: {
      desc: String,
      src: String,
    },
  };
</script>
