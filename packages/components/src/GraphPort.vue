<template>
  <div class="reagraph__port" :class="[`reagraph__port-${id}`, props.classes]" :style="styleBinding ? style : undefined"></div>
</template>

<script setup lang="ts">
import { definePort, useGraph, usePortStyle } from "@vue-reagraph/composables";
import { computed } from "vue";
const props = withDefaults(
  defineProps<{
    id: string;
    size?: number;
    color?: string;
    borderColor?: string;
    borderWidth?: string;
    borderStyle?: string;
    classes?: string | string[];
    styleBinding?: boolean;
    side?: "in" | "out";
    linkingScale?: number;
  }>(),
  {
    size: 8,
    color: "#ee0000",
    borderColor: "#777",
    borderWidth: "0.5px",
    borderStyle: "solid",
    classes: "",
    styleBinding: true,
    linkingScale: 1.5,
  }
);
const { isLinking } = useGraph()!;
const isIn = computed(() => props.id.includes("-in"));
const isOut = computed(() => props.id.includes("-out"));
const side = computed(() => props.side || (isIn.value ? "in" : isOut.value ? "out" : undefined));
const linkingScale = computed(() => ({ scale: isLinking.value ? props.linkingScale : 1 }));
const style = usePortStyle({ ...props, side, size: computed(() => props.size * linkingScale.value.scale) });
definePort({ id: props.id });
</script>

<style scoped></style>
