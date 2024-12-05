<template>
  <div class="wfull hfull overflow-hidden absolute top-0 left-0">
    <GraphBackground />
    <GraphLinks />
    <GraphNode>
      <template #title>Hello</template>
      <template #content>
        <div class="wfull relative">
          <div class="px-2 py-1">World</div>
          <GraphPort id="property-out" />
        </div>
      </template>
    </GraphNode>

    <GraphNode>
      <template #title>Hello</template>
      <template #content>
        <div class="wfull relative">
          <div class="px-2 py-1">World</div>
          <GraphPort id="property-out" />
        </div>
      </template>
    </GraphNode>
  </div>
</template>

<script setup lang="ts">
import { defineGraph } from "@vue-reagraph/composables";
import { GraphBackground, GraphLinks, GraphNode, GraphPort } from "@vue-reagraph/components";
defineGraph({});
</script>

<style>
:root,
html,
body,
#app {
  @apply wfull hfull p-0 m-0;
}
</style>
