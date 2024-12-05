<template>
  <div class="reagraph__node">
    <div class="reagraph__node-title" ref="title">
      <slot name="title"></slot>
    </div>
    <div class="reagraph__node-content" ref="content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineNode } from "@vue-reagraph/composables";
import { ref } from "vue";

const title = ref<HTMLDivElement | null>(null);
defineNode({ handler: title });
</script>

<style scoped>
.reagraph__node {
  @apply min-w-48 border-solid border border-gray-300 rounded-md bg-white shadow-md select-none relative;
  & .reagraph__node-title {
    @apply text-lg font-medium text-gray-900 bg-gray-100 rounded-md text-center;
  }
}
</style>
