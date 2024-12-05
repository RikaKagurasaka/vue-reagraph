<template>
  <svg class="reagraph__links-container">
    <path class="reagraph__link" v-for="path in pathes" :d="path.d" :key="linkToKey(path.link)" :class="{ 'reagraph__link--dangling': !path.link.targetNodeId && !path.link.targetPortId }" />
  </svg>
</template>

<script setup lang="ts">
import { linkToKey, renderLinks } from "@vue-reagraph/composables";
const { pathes } = renderLinks({});
</script>

<style scoped>
.reagraph__links-container {
  @apply wfull hfull absolute pointer-events-none;
}
.reagraph__link {
  stroke: #000;
  stroke-width: 2;
  stroke-linecap: round;
  fill: none;
}
.reagraph__link--dangling {
  stroke: #777;
  animation: dash 0.5s linear alternate-reverse infinite;
  stroke-dasharray: 10, 10;
}

@keyframes dash {
  to {
    stroke-dashoffset: 20;
  }
}
</style>
