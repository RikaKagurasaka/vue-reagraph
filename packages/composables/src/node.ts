import { injectLocal, provideLocal, toReactive, useCurrentElement, useEventListener } from "@vueuse/core";
import { CSSProperties, isRef, MaybeRef, MaybeRefOrGetter, onBeforeUnmount, onMounted, provide, Ref, ref, toValue, UnwrapRef } from "vue";
import { v4 } from "uuid";
import injectKeys from "./injectKeys";
import { Vec2 } from "./graph";
import { Property } from "csstype";
import { useHandlerStyle, useNodeStyle } from "./styles";
import { IPort } from "./port";

export interface INode {
  uuid: MaybeRefOrGetter<string>;
  position: Ref<[number, number]>;
  el: MaybeRefOrGetter<HTMLElement | null>;
  isDragging: Ref<boolean>;
  styles: Ref<CSSProperties>;
  handlerStyles: Ref<CSSProperties>;
  ports: Ref<UnwrapRef<IPort>[]>;
}

export interface DefineNodeOptions {
  uuid?: MaybeRefOrGetter<string>;
  position?: MaybeRef<[number, number]>;
  el?: MaybeRefOrGetter<HTMLElement | null>;
  handler?: MaybeRefOrGetter<HTMLElement | null>;
  styleBinding?: MaybeRefOrGetter<boolean>;
  cursorNormal?: MaybeRefOrGetter<Property.Cursor>;
  cursorGrab?: MaybeRefOrGetter<Property.Cursor | boolean>;
}

export function defineNode({ uuid = ref(v4()), position: posiiton_ = ref([0, 0]), el = useCurrentElement(), handler = el, styleBinding = true, cursorNormal, cursorGrab = true }: DefineNodeOptions) {
  const position = isRef(posiiton_) ? posiiton_ : ref(toValue(posiiton_));
  const graphTransform = injectLocal(injectKeys.graphTransform);
  if (!graphTransform) {
    throw new Error("`defineNode` requires `defineGraph` to be called at a parent component.");
  }
  const nodes = injectLocal(injectKeys.nodes);
  const links = injectLocal(injectKeys.links);
  const ports = ref([]) as Ref<UnwrapRef<IPort>[]>;
  provideLocal(injectKeys.ports, ports);
  if (!nodes) {
    console.error("`defineNode` requires `defineGraph` to be called at a parent component.");
  }
  if (!links) {
    console.error("`defineNode` requires `defineGraph` to be called at a parent component.");
  }

  const { isDragging } = useDraggableNode({ position, handler, graphTransform });

  const styles = useNodeStyle({ el, position, styleBinding, graphTransform });
  const handlerStyles = useHandlerStyle({ handler, isDragging, cursorNormal, cursorGrab, styleBinding });

  const node = { uuid, position, el, isDragging, styles, handlerStyles, ports };
  onMounted(() => {
    if (nodes) {
      nodes.value = [...nodes.value, toReactive(node)];
    }
  });
  onBeforeUnmount(() => {
    if (nodes) {
      const index = nodes.value.findIndex((n) => toValue(n.uuid) === toValue(node.uuid));
      if (index !== -1) {
        nodes.value.splice(index, 1);
      }
    }
  });
  provide(injectKeys.node, node);
  return node;
}

interface UseDraggableNodeOptions {
  position: Ref<[number, number]>;
  handler: MaybeRefOrGetter<HTMLElement | null>;
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

  useEventListener(handler, "mouseup", () => {
    isDragging.value = false;
  });

  return {
    isDragging,
  };
}
