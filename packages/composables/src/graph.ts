import { ref, Ref, UnwrapRef } from "vue";
import { INode } from "./node";
import { ILink, useLinksManager } from "./link";
import injectKeys from "./injectKeys";
import { provideLocal } from "@vueuse/core";

export type Vec2 = [number, number];
export interface UseGraphOptions {
  nodes?: Ref<UnwrapRef<INode>[]>;
  links?: Ref<UnwrapRef<ILink>[]>;
  checkLinkable?: (link: ILink) => boolean;
}
export interface GraphTransform {
  position: Vec2;
  scale: number;
}

export function defineGraph(options?: UseGraphOptions) {
  const { nodes = ref([]), links = ref([]), checkLinkable = () => true } = options || {};
  const transform = ref({ position: [0, 0], scale: 1 } as { position: Vec2; scale: number });
  provideLocal(injectKeys.graphTransform, transform);
  provideLocal(injectKeys.nodes, nodes);
  provideLocal(injectKeys.links, links);
  const { isLinking, isLinkable } = useLinksManager({ checkLinkable });
  return { links, nodes, graphTransform: transform, isLinking, isLinkable };
}

export function screenToGraphPosition(screenPosition: Vec2, graphTransform: { position: Vec2; scale: number }) {
  return [screenPosition[0] * graphTransform.scale + graphTransform.position[0], screenPosition[1] * graphTransform.scale + graphTransform.position[1]] as Vec2;
}

export function graphToScreenPosition(graphPosition: Vec2, graphTransform: { position: Vec2; scale: number }) {
  return [(graphPosition[0] - graphTransform.position[0]) / graphTransform.scale, (graphPosition[1] - graphTransform.position[1]) / graphTransform.scale] as Vec2;
}
