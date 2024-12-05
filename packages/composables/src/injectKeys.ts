import { InjectionKey, Ref } from "vue";
import { GraphTransform } from "./graph";
import { INode } from "./node";
import { ILink } from "./link";
import { IPort } from "./port";

export default {
  graphTransform: Symbol("graphTransform") as InjectionKey<Ref<GraphTransform>>,
  node: Symbol("node") as InjectionKey<INode>,
  nodes: Symbol("nodes") as InjectionKey<Ref<INode[]>>,
  links: Symbol("links") as InjectionKey<Ref<ILink[]>>,
  ports: Symbol("ports") as InjectionKey<Ref<IPort[]>>,
};
