<template>
  <div style="width: 100dvw; height: 100dvh" ref="bg"></div>
</template>

<script setup lang="ts">
import { defineGraph, presetBackgroundLineGrid, useBackground } from "@vue-reagraph/composables";
import { Ref, ref } from "vue";
const bg = ref() as Ref<HTMLDivElement>;
const { graphTransform } = defineGraph({});
useBackground({ graphTransform, backgroundElement: bg, backgroundGridPreset: presetBackgroundLineGrid({ theme: "dark" }) });
</script>

<style scoped></style>
