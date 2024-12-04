<template>
  <div style="width: 100dvw; height: 100dvh; display: fixed; left: 0; top: 0; color: white" ref="bg">
    <div
      style="position: absolute; background-color: #777; width: 10px; height: 10px; border-radius: 10px"
      :style="{
        left: graphToScreenPosition([0, 0], graphTransform)[0] + 'px',
        top: graphToScreenPosition([0, 0], graphTransform)[1] + 'px',
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { defineGraph, graphToScreenPosition, presetBackgroundLineGrid, useBackground } from "@vue-reagraph/composables";
import { Ref, ref } from "vue";
const bg = ref() as Ref<HTMLDivElement>;
const { graphTransform } = defineGraph({});
useBackground({ graphTransform, backgroundElement: bg, backgroundGridPreset: presetBackgroundLineGrid({ theme: "dark" }) });
</script>

<style>
* {
  padding: 0%;
  margin: 0%;
}
</style>
