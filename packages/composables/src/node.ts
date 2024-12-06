import { useCurrentElement, useEventListener } from "@vueuse/core";
import { CSSProperties, isRef, MaybeRef, onBeforeUnmount, onMounted, Ref, ref, toValue, UnwrapRef } from "vue";
import { v4 } from "uuid";
import { useGraph, Vec2 } from "./graph";
import { Property } from "csstype";
import { useHandlerStyle, useNodeStyle } from "./styles";
import { IPort } from "./port";
import injectKeys, { createLocalInjectionState } from "./injectKeys";

export interface INode {
  uuid: MaybeRef<string>;
  position: Ref<[number, number]>;
  el: MaybeRef<HTMLElement | null>;
  isDragging: Ref<boolean>;
  style: Ref<CSSProperties>;
  handlerStyle: Ref<CSSProperties>;
  ports: Ref<UnwrapRef<IPort>[]>;
}

export interface DefineNodeOptions {
  uuid?: MaybeRef<string>;
  position?: MaybeRef<[number, number]>;
  el?: MaybeRef<HTMLElement | null>;
  handler?: MaybeRef<HTMLElement | null>;
  styleBinding?: MaybeRef<boolean>;
  cursorNormal?: MaybeRef<Property.Cursor>;
  cursorGrab?: MaybeRef<Property.Cursor | boolean>;
}

function _defineNode(options?: DefineNodeOptions) {
  const { uuid = ref(v4()), position: posiiton_ = ref([0, 0] as Vec2), el = useCurrentElement<HTMLElement>(), handler = el, styleBinding = false, cursorNormal, cursorGrab = true } = options ?? {};
  const position = isRef(posiiton_) ? posiiton_ : ref(toValue(posiiton_));
  const { graphTransform, nodes, addNode, removeNode, links, removeLink, findLinks } = useGraph()!;
  const ports = ref([]) as Ref<UnwrapRef<IPort>[]>;

  const { isDragging } = useDraggableNode({ position, handler, graphTransform });

  const style = useNodeStyle({ el, position, styleBinding, graphTransform });
  const handlerStyle = useHandlerStyle({ handler, isDragging, cursorNormal, cursorGrab, styleBinding });

  const node = { uuid, position, el, isDragging, style, handlerStyle, ports };
  onMounted(() => {
    if (nodes) {
      addNode(node);
    }
  });
  onBeforeUnmount(() => {
    if (nodes) {
      const index = nodes.value.findIndex((n) => toValue(n.uuid) === toValue(node.uuid));
      if (index !== -1) {
        removeNode(toValue(node.uuid));
      }
    }
    if (links) {
      findLinks({ sourceNodeId: toValue(node.uuid) }).forEach((l) => removeLink(l));
      findLinks({ targetNodeId: toValue(node.uuid) }).forEach((l) => removeLink(l));
    }
  });
  return node;
}
export const [defineNode, useNode] = createLocalInjectionState(_defineNode, injectKeys.node);

interface UseDraggableNodeOptions {
  position: Ref<[number, number]>;
  handler: MaybeRef<HTMLElement | null>;
  graphTransform: Ref<{ position: [number, number]; scale: number }>;
}

function useDraggableNode({ position, handler, graphTransform }: UseDraggableNodeOptions) {
  const isDragging = ref(false);
  const lastMousePosition = ref<Vec2>([0, 0]);
  useEventListener(handler, "mousedown", (event) => {
    isDragging.value = true;
    lastMousePosition.value = [event.clientX, event.clientY];
  });

  useEventListener("mousemove", (event) => {
    if (isDragging.value) {
      const delta = [(event.clientX - lastMousePosition.value[0]) * toValue(graphTransform).scale, (event.clientY - lastMousePosition.value[1]) * toValue(graphTransform).scale];
      position.value = [position.value[0] + delta[0], position.value[1] + delta[1]];
      lastMousePosition.value = [event.clientX, event.clientY];
    }
  });

  useEventListener("mouseup", () => {
    lastMousePosition.value = [0, 0];
    isDragging.value = false;
  });

  return {
    isDragging,
  };
}
