<template>
  <div>
    <Button type="primary" @click="backHome">
      <span>返&nbsp;回</span>
    </Button>
    <Button type="primary" @click="backPrev">
      <span>返回上一页</span>
    </Button>
  </div>
</template>

<script>
  import './error.scss';
  export default {
    name: 'backBtnGroup',
    data() {
      return {};
    },
    methods: {
      backHome() {
        this.$router.push('/login');
      },
      backPrev() {
        this.$router.go(-1);
      },
    },
  };
</script>
