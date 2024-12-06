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
import { defineNode, injectKeys } from "@vue-reagraph/composables";
import { injectLocal } from "@vueuse/core";
import { ref } from "vue";

if (!injectLocal(injectKeys.node, undefined)) {
  const title = ref<HTMLDivElement | null>(null);
  defineNode({ handler: title, styleBinding: true });
}
</script>

<style scoped>
.reagraph__node {
  /* @apply min-w-48 border-solid border border-gray-300 rounded-md bg-white shadow-md select-none; */
  min-width: 192px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  user-select: none;
  & .reagraph__node-title {
    /* @apply text-lg font-medium text-gray-900 bg-gray-100 rounded-md text-center; */
    font-size: 18px;
    line-height: 28px;
    font-weight: 500;
    color: #333;
    background-color: #f0f0f0;
    border-radius: 4px;
    text-align: center;
  }
}
</style>
