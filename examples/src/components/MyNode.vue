<template>
  <GraphNode>
    <template #title>
      <div ref="titleRef">{{ props.title }}</div>
    </template>
    <template #content>
      <div class="wfull relative">
        <div class="px-2 py-1">{{ content }}</div>
        <GraphPort id="mynode-input" v-if="isInput" />
        <GraphPort id="mynode-output" v-if="isOutput" />
      </div>
      <div class="wfull flex justify-end">
        <button @click="emit('delete', props.uuid)" class="text-red px-2 py-1 rounded-md border-none text-sm bg-transparent cursor-pointer hover:bg-red-500 hover:text-white">Delete</button>
      </div>
    </template>
  </GraphNode>
</template>

<script setup lang="ts">
import { GraphNode, GraphPort } from "@vue-reagraph/components";
import { defineNode } from "@vue-reagraph/composables";
import { useVModel } from "@vueuse/core";
import { ref } from "vue";
const props = defineProps<{
  uuid: string;
  title: string;
  content: string;
  position: [number, number];
  isInput?: boolean;
  isOutput?: boolean;
}>();
const titleRef = ref<HTMLDivElement | null>(null);
const position = useVModel(props, "position");
defineNode({
  handler: titleRef,
  uuid: props.uuid,
  styleBinding: true,
  position,
});
const emit = defineEmits<{
  (e: "delete", uuid: string): void;
}>();
</script>
