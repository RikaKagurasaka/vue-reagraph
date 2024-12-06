<template>
  <svg class="reagraph__links-container">
    <GraphLink v-for="link in links" :key="linkToKey(link)" :link="link" />
  </svg>
</template>

<script setup lang="ts">
import { linkToKey, useGraph } from "@vue-reagraph/composables";
import GraphLink from "./GraphLink.vue";

const links = useGraph()!.links;
</script>

<style scoped>
.reagraph__links-container {
  /* @apply wfull hfull absolute pointer-events-none; */
  width: 100%;
  height: 100%;
  position: absolute;
  pointer-events: none;
  user-select: none;
}
</style>
