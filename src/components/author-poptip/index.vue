<template>
  <div class="author" @click="visible = true">
    <div class="author-warning">
      <img src="@/assets/img/message/warning.png" />
    </div>
    <div class="author-container" v-show="visible">
      <div class="author-title">授权到期提醒</div>
      <div class="author-content">
        {{ `您的授权还有${effectiveDays}天到期` }}
      </div>
      <div class="author-btns">
        <Button class="mr" @click.stop="cancelHandle">取消</Button>
        <Button type="primary" @click.stop="authorHandle">去授权</Button>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { ref } from 'vue';
  import UseCommonStore from '@/stores/modules/common';
  const commonStore = UseCommonStore();
  defineProps({
    effectiveDays: {
      type: Number,
      default: 0,
    },
  });

  let visible = ref(true);
  function cancelHandle() {
    visible.value = false;
  }
  function authorHandle() {
    if (window.sessionStorage.getItem('authorUrl')) {
      window.location.href = `${window.sessionStorage.getItem(
        'authorUrl',
      )}?redirect=${encodeURIComponent(window.location.href)}&applicationCode=${
        commonStore.localConfig.ApplicationCode
      }&type=licence`;
    } else {
      window.location.href = window.location.host + '/404';
    }
  }
</script>
<style lang="scss" scoped>
  .author {
    position: relative;
    display: inline-block;
    height: 53px;
    margin-right: 10px;

    .author-warning {
      display: flex;
      height: 100%;
      padding: 10px;
      cursor: pointer;
      align-items: center;

      & > img {
        width: 18px;
        height: 18px;
      }
    }

    .author-container {
      position: absolute;
      left: 50%;
      z-index: 900;
      padding: 20px;
      color: #fff;
      background: #051e43;
      border-radius: 4px;
      transform: translate(-50%, 0);
      box-shadow: 0 1px 6px rgb(0 0 0 / 20%);

      .author-title {
        line-height: 20px;
        text-align: left;
      }

      .author-content {
        margin: 20px 0;
        line-height: 20px;
        text-align: center;
      }

      .author-btns {
        display: flex;

        .mr {
          margin-right: 30px;
        }
      }
    }

    .author-container::after {
      position: absolute;
      top: -6px;
      left: 50%;
      width: 0;
      height: 0;
      border-right: 10px solid transparent;
      border-bottom: 10px solid #051e43;
      border-left: 10px solid transparent;
      content: '';
      transform: translate(-50%, 0);
    }
  }
</style>
