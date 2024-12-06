<template>
  <path
    class="reagraph__link"
    :d="path"
    :class="{
      'reagraph__link--dangling': isDangling,
      'reagraph__link--positive': direction === 'positive',
      'reagraph__link--negative': direction === 'negative',
    }"
  />
</template>

<script setup lang="ts">
import { defineLink, ILink, presetLinkPathDefault, useGraph } from "@vue-reagraph/composables";
import { computed } from "vue";

const props = defineProps<{
  link: ILink;
}>();
const { isDangling, direction } = defineLink(props.link);
const { graphTransform } = useGraph()!;
const scale = computed(() => graphTransform.value.scale);
const path = presetLinkPathDefault(0.5);
</script>

<style scoped>
.reagraph__link {
  pointer-events: all;
  stroke: #000;
  stroke-width: calc(2 / v-bind(scale) * 1px);
  stroke-linecap: round;
  fill: none;
  &:not(.reagraph__link--dangling) {
    cursor: pointer;
    &:hover {
      stroke-width: calc(2 / v-bind(scale) * 1.5px);
    }
  }
}
.reagraph__link--dangling {
  stroke: #777;
  stroke-dasharray: calc(10 / v-bind(scale) * 1px), calc(10 / v-bind(scale) * 1px);
  &.reagraph__link--positive {
    animation: dash 0.5s linear infinite;
  }
  &.reagraph__link--negative {
    animation: dash 0.5s linear reverse infinite;
  }
}

@keyframes dash {
  from {
    stroke-dashoffset: calc(20 / v-bind(scale) * 1px);
  }
  to {
    stroke-dashoffset: 0;
  }
}
</style>
