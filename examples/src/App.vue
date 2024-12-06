<template>
  <div class="wfull hfull overflow-hidden absolute top-0 left-0">
    <GraphBackground />
    <GraphLinks />
    <MyNode v-for="node in rawNodes" v-model:position="node.position" :key="node.uuid" :uuid="node.uuid" :content="node.content" :is-input="node.isInput" :is-output="node.isOutput" :title="node.title" @delete="(uuid) => (rawNodes = rawNodes.filter((n) => n.uuid !== uuid))" />
    <div class="absolute top-0 left-0 flex">
      <button @click="addNode('S', true)">Add Source Node (S)</button>
      <button @click="addNode('T', true)">Add Target Node (T)</button>
      <button @click="addNode('M', true)">Add Middle Node (M)</button>
    </div>
    <textarea class="absolute right-0 top-0 h1/2 w-1/4" :value="JSON.stringify(rawNodes, null, 2)" />
    <textarea class="absolute right-0 top-1/2 h1/2 w-1/4" :value="JSON.stringify(links, null, 2)" />
  </div>
</template>

<script setup lang="ts">
import { defineGraph, screenToGraphPosition } from "@vue-reagraph/composables";
import { GraphBackground, GraphLinks } from "@vue-reagraph/components";
import MyNode from "./components/MyNode.vue";
import { ref } from "vue";
import { toValue } from "vue";
import { useCurrentElement, useEventListener, useMouse } from "@vueuse/core/index.cjs";
const { graphTransform, links } = defineGraph();
const rawNodes = ref([
  {
    uuid: "foo-1",
    content: "Foo 1 ",
    title: "Foo",
    position: [500, 100] as [number, number],
    isInput: true,
  },
  {
    uuid: "bar-1",
    content: "Bar 1 ",
    title: "Bar",
    position: [100, 100] as [number, number],
    isOutput: true,
  },
] as {
  uuid: string;
  content: string;
  title: string;
  position: [number, number];
  isInput?: boolean;
  isOutput?: boolean;
}[]);

const currentElement = useCurrentElement<HTMLElement>();

function getScreenCenterPositon() {
  const position = [currentElement.value!.clientWidth / 2, currentElement.value!.clientHeight / 2] as [number, number];
  return screenToGraphPosition(position, toValue(graphTransform));
}

const mouse = useMouse();

function addNode(type: "S" | "T" | "M", atCenter: boolean) {
  const position = atCenter ? getScreenCenterPositon() : screenToGraphPosition([toValue(mouse.x), toValue(mouse.y)], toValue(graphTransform));
  rawNodes.value.push({
    uuid: `${type}-${Date.now()}`,
    position,
    title: type,
    content: `${type} ${Math.random().toString(36).substring(2, 15)}`,
    isInput: type === "T" || type === "M",
    isOutput: type === "S" || type === "M",
  });
}

useEventListener("keypress", (e) => {
  if (e.key === "s") addNode("S", false);
  if (e.key === "t") addNode("T", false);
  if (e.key === "m") addNode("M", false);
});
</script>

<style>
:root,
html,
body,
#app {
  @apply wfull hfull p-0 m-0;
}
</style>
