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
  return { links, nodes, graphTransform: transform };
}
