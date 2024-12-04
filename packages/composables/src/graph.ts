import { provide, ref, Ref } from "vue";
import { INode } from "./node";
import { ILink } from "./link";
import injectKeys from "./injectKeys";

export type Vec2 = [number, number];
export interface UseGraphOptions<TNode extends INode = INode, TLink extends ILink = ILink> {
  nodes?: Ref<TNode[]>;
  links?: Ref<TLink[]>;
}
export interface GraphTransform {
  position: Vec2;
  scale: number;
}

export function defineGraph<TNode extends INode = INode, TLink extends ILink = ILink>({ nodes = ref([]), links = ref([]) }: UseGraphOptions<TNode, TLink>) {
  const transform = ref({ position: [0, 0], scale: 1 } as { position: Vec2; scale: number });
  provide(injectKeys.graphTransform, transform);
  provide(injectKeys.nodes, nodes);
  provide(injectKeys.links, links);
  return { links, nodes, graphTransform: transform };
}

export function screenToGraphPosition(screenPosition: Vec2, graphTransform: { position: Vec2; scale: number }) {
  return [screenPosition[0] * graphTransform.scale + graphTransform.position[0], screenPosition[1] * graphTransform.scale + graphTransform.position[1]] as Vec2;
}

export function graphToScreenPosition(graphPosition: Vec2, graphTransform: { position: Vec2; scale: number }) {
  return [(graphPosition[0] - graphTransform.position[0]) / graphTransform.scale, (graphPosition[1] - graphTransform.position[1]) / graphTransform.scale] as Vec2;
}
