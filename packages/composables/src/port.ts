import { toReactive, useCurrentElement, useEventListener } from "@vueuse/core";
import { MaybeRef, onBeforeUnmount, onMounted, Ref, toRef, toValue } from "vue";
import { useLinksManager } from "./link";
import { useNode } from "./node";
import { useGraph } from "./graph";
import injectKeys, { createLocalInjectionState } from "./injectKeys";

export interface IPort {
  id: Ref<string>;
  nodeId: Ref<string>;
  el: Ref<HTMLElement | null>;
}

export interface DefinePortOptions {
  id: MaybeRef<string>;
  el?: MaybeRef<HTMLElement | null>;
}

function _definePort({ id, el = useCurrentElement() }: DefinePortOptions) {
  const node = useNode()!;
  const ports = node.ports;
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
      ports.value.push(toReactive(port));
    }
  });
  onBeforeUnmount(() => {
    ports.value = ports.value.filter((p) => toValue(p.id) !== toValue(id));
  });
  useDraggablePort({ el, id });
  return port;
}
export const [definePort, usePort] = createLocalInjectionState(_definePort, injectKeys.port);

function useDraggablePort({ el, id }: { el: MaybeRef<HTMLElement | null>; id: MaybeRef<string> }) {
  const { nodes, links, graphTransform } = useGraph()!;
  const node = useNode()!;
  const { onPortMouseDown, onPortMouseUp, onPortMouseMove, onPortMouseLeave } = useLinksManager()!;
  if (!toValue(nodes) || !toValue(links) || !toValue(graphTransform)) {
    throw new Error("`useDraggablePort` requires proper injection of nodes, links and node.");
  }
  const port = { id: toRef(id), el: toRef(el), nodeId: toRef(node.uuid) };
  useEventListener(el, "mousedown", (event) => onPortMouseDown(event, port, node));
  useEventListener(el, "mouseup", (event) => onPortMouseUp(event, port, node));
  useEventListener(el, "mousemove", (event) => onPortMouseMove(event, port, node));
  useEventListener(el, "mouseleave", (event) => onPortMouseLeave(event, port, node));
}
