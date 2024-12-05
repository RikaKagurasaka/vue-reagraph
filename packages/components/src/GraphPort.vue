<template>
  <div class="reagraph__port" :class="[`reagraph__port-${id}`, props.classes]" :style="style"></div>
</template>

<script setup lang="ts">
import { definePort, usePortStyle } from "@vue-reagraph/composables";
import { computed } from "vue";
const props = withDefaults(
  defineProps<{
    id: string;
    size?: number | string;
    color?: string;
    borderColor?: string;
    borderWidth?: string;
    borderStyle?: string;
    classes?: string | string[];
    styleBinding?: boolean;
    side?: "left" | "right"; 
  }>(),
  { 
    size: 8,
    color: "#ee0000",
    borderColor: "#777",
    borderWidth: "0.5px",
    borderStyle: "solid",
    classes: "",
    styleBinding: true,
  }
);

const isLeft = computed(() => props.id.includes("left") || props.id.includes("in"));
const isRight = computed(() => props.id.includes("right") || props.id.includes("out"));
const side = computed(() => props.side || (isLeft.value ? "left" : isRight.value ? "right" : undefined));
const style = usePortStyle({ ...props, side });
definePort({ id: props.id });
</script>

<style scoped></style>
