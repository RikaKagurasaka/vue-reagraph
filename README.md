# Vue ReaGraph (WIP)

Vue ReaGraph is a Vue 3 library for building node-based graph interfaces. It provides composables and components for creating custom node graphs with draggable nodes and connectable ports.

## Features

- Draggable nodes with customizable styles and content
- Connectable ports between nodes. One node can have multiple ports.
- Composable-API first. You can use no components and only composables if you want.

## Installation

(Not released yet)

## Usage

Use pre-defined components:

```vue
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
  </div>
</template>

<script setup lang="ts">
import { defineGraph } from "@vue-reagraph/composables";
import { GraphBackground, GraphLinks, GraphNode, GraphPort } from "@vue-reagraph/components";
defineGraph({});
</script>
```

For more details, see the documentation (not ready yet).
