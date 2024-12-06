<template>
  <div class="reagraph__background"></div>
</template>

<script setup lang="ts">
import { useBackground } from "@vue-reagraph/composables";
useBackground({});
</script>

<style scoped>
.reagraph__background {
  /* @apply w-full h-full absolute top-0 left-0; */
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  user-select: none;
}
</style>
