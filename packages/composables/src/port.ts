import { injectLocal, useCurrentElement, useEventListener } from "@vueuse/core";
import { MaybeRefOrGetter, onBeforeUnmount, onMounted, Ref, toRef, toValue } from "vue";
import injectKeys from "./injectKeys";
import { useLinksManager } from "./link";
import { INode } from "./node";

export interface IPort {
  id: Ref<string>;
  nodeId: Ref<string>;
  el: Ref<HTMLElement | null>;
}

export interface DefinePortOptions {
  id: MaybeRefOrGetter<string>;
  el?: MaybeRefOrGetter<HTMLElement | null>;
}

export function definePort({ id, el = useCurrentElement() }: DefinePortOptions) {
  const ports = injectLocal(injectKeys.ports) as Ref<IPort[]> | undefined;
  const node = injectLocal(injectKeys.node) as INode | undefined;

  if (!ports || !node) {
    throw new Error("`definePort` requires `defineNode` to be called at a parent component.");
  }
  if (!el) {
    throw new Error("`definePort` requires `el` to be provided.");
  }
  const port = { id: toRef(id), nodeId: toRef(node.uuid), el: toRef(el) };
  onMounted(() => {
    if (toValue(ports).find((p) => toValue(p.id) === toValue(id))) {
      console.warn(`Port with id ${toValue(id)} already exists. Is id duplicate or the onMounted hook called multiple times?`);
    } else {
      ports.value.push(port);
    }
  });
  onBeforeUnmount(() => {
    ports.value = ports.value.filter((p) => toValue(p.id) !== toValue(id));
  });
  useDraggablePort({ el, id });
  return port;
}

function useDraggablePort({ el, id }: { el: MaybeRefOrGetter<HTMLElement | null>; id: MaybeRefOrGetter<string> }) {
  const nodes = injectLocal(injectKeys.nodes)!;
  const links = injectLocal(injectKeys.links)!;
  const node = injectLocal(injectKeys.node)!;
  const { onPortMouseDown, onPortMouseUp, onPortMouseMove } = useLinksManager();
  if (!toValue(nodes) || !toValue(links) || !toValue(node)) {
    throw new Error("`useDraggablePort` requires proper injection of nodes, links and node.");
  }
  const port = { id: toRef(id), el: toRef(el), nodeId: toRef(node.uuid) };
  useEventListener(el, "mousedown", (event) => onPortMouseDown(event, port, node));
  useEventListener(el, "mouseup", (event) => onPortMouseUp(event, port, node));
  useEventListener(el, "mousemove", (event) => onPortMouseMove(event, port, node));
}
