<template>
  <div style="width: 100dvw; height: 100dvh; display: fixed; left: 0; top: 0; color: white">
    <GraphBackground />
  </div>
</template>

<script setup lang="ts">
import { defineGraph } from "@vue-reagraph/composables";
import { GraphBackground } from "@vue-reagraph/components";

defineGraph({});
</script>

<style>
* {
  padding: 0%;
  margin: 0%;
}
</style>
