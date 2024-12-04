import { InjectionKey, Ref } from "vue";
import { GraphTransform } from "./graph";
import { INode } from "./node";
import { ILink } from "./link";

export default {
  graphTransform: Symbol("graphTransform") as InjectionKey<Ref<GraphTransform>>,
  nodes: Symbol("nodes") as InjectionKey<Ref<INode[]>>,
  links: Symbol("links") as InjectionKey<Ref<ILink[]>>,
};
