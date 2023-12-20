<template>
  <div>
    <ui-page
      v-model:pageNum="pageData.pageNum"
      v-model:pageSize="pageData.pageSize"
      :total-count="pageData.totalCount"
    />
  </div>
</template>

<script setup>
  import { reactive } from 'vue';

  const pageData = reactive({
    totalCount: 10000,
    pageNum: 1,
    pageSize: 20,
  });
</script>

<style lang="scss" scoped></style>
