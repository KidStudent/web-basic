<template>
  <div class="cover" :style="{ background: bgColor }">
    <img v-if="skin === 'dark'" src="@/assets/img/common/loading.gif" alt="" />
    <svg
      v-else
      class="loading"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      width="40px"
      height="40px"
      viewBox="0 0 50 50"
      style="enable-background: new 0 0 50 50"
      xml:space="preserve"
    >
      <path
        :fill="color"
        d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"
      >
        <animateTransform
          attributeType="xml"
          attributeName="transform"
          type="rotate"
          from="0 25 25"
          to="360 25 25"
          dur="0.6s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
    <div class="text">
      <slot />
    </div>
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue';
  defineProps({
    color: {
      default: '#55c5f2',
    },
  });

  let skin = ref(null);
  let bgColor = ref(null);

  onMounted(() => {
    skin.value = document.documentElement.getAttribute(`web-basic-skin`);
    bgColor.value = skin.value === 'dark' ? '#071B39' : '#fff';
  });
</script>

<style lang="scss" scoped>
  .cover {
    position: absolute;
    inset: 0;
    z-index: 10;
    margin: auto;

    img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
    }
  }

  .loading {
    position: absolute;
    inset: 0;
    z-index: 10;
    margin: auto;
  }

  .text {
    display: flex;
    height: calc(100% - 70px);
    margin-top: 70px;
    text-align: center;
    align-items: center;
    justify-content: center;
  }

  /*
    Set the color of the icon
*/
  // svg path,
  // svg rect {
  //     fill: #ff6700;
  // }
</style>
