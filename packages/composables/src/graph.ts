import { computed, ComputedRef, ref, Ref, toValue, UnwrapRef } from "vue";
import { INode } from "./node";
import { defineLinksManager, ILink } from "./link";
import injectKeys, { createLocalInjectionState } from "./injectKeys";
import { useLinksMethods, useNodesMethods } from "./utils";
import { IPort } from "./port";

export type Vec2 = [number, number];
export interface UseGraphOptions {
  nodes?: Ref<UnwrapRef<INode>[]>;
  links?: Ref<UnwrapRef<ILink>[]>;
  checkLinkable?: (link: ILink, nodes: UnwrapRef<INode>[], links: UnwrapRef<ILink>[]) => boolean;
}
export interface GraphTransform {
  position: Vec2;
  scale: number;
}

function _defineGraphRaw(options?: UseGraphOptions) {
  const { nodes = ref([]), links = ref([]) } = options || {};
  const transform = ref({ position: [0, 0], scale: 1 } as { position: Vec2; scale: number });
  const ports = computed(() => {
    return toValue(nodes)!
      .map((node) => toValue(node.ports))
      .flat();
  });
  return { links, nodes, graphTransform: transform, ports };
}

export interface UseGraphRawReturn {
  links: Ref<UnwrapRef<ILink>[]>;
  nodes: Ref<UnwrapRef<INode>[]>;
  graphTransform: Ref<GraphTransform>;
  ports: ComputedRef<IPort[]>;
}

export const [defineGraphRaw, useGraphRaw] = createLocalInjectionState(_defineGraphRaw, injectKeys.graphRaw);

function _defineGraph(options?: UseGraphOptions) {
  return {
    ...defineGraphRaw(options),
    ...defineLinksManager(),
    ...useNodesMethods(),
    ...useLinksMethods(),
  };
}
export const [defineGraph, useGraph] = createLocalInjectionState(_defineGraph, injectKeys.graph);

export function screenToGraphPosition(screenPosition: Vec2, graphTransform: { position: Vec2; scale: number }) {
  return [screenPosition[0] * graphTransform.scale + graphTransform.position[0], screenPosition[1] * graphTransform.scale + graphTransform.position[1]] as Vec2;
}

export function graphToScreenPosition(graphPosition: Vec2, graphTransform: { position: Vec2; scale: number }) {
  return [(graphPosition[0] - graphTransform.position[0]) / graphTransform.scale, (graphPosition[1] - graphTransform.position[1]) / graphTransform.scale] as Vec2;
}
