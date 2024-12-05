import { BackgroundGridFunction, presetBackgroundLineGrid } from "./styles";
import { useCurrentElement, useEventListener } from "@vueuse/core";
import { useElementStyle } from "@vueuse/motion";
import { MaybeRef, MaybeRefOrGetter, watch, toValue, ref, inject, Ref } from "vue";
import { GraphTransform, screenToGraphPosition, Vec2 } from "./graph";
import injectKeys from "./injectKeys";

export interface UseBackgroundOptions {
  /** The tranlate and scale of the graph view */
  graphTransform?: Ref<GraphTransform>;
  /** The function that generates the background style, defaulting to `presetBackgroundLineGrid({})` */
  backgroundGridPreset?: BackgroundGridFunction;
  /** The element to apply the background style and listen for dragging events */
  backgroundElement?: MaybeRef<HTMLElement>;
  /** Whether to auto bind the background style to the element style. If `false`, you need to manually apply the style to the element, which enables you to modify the style before applying it. */
  backgroundStyleBinding?: MaybeRefOrGetter<boolean>;
  /** Whether to disable dragging the view. Default is `false`. The `ref` will be returned to allow you to change it later. */
  disableDragging?: MaybeRefOrGetter<boolean>;
  /** Whether to disable scaling the view. Default is `false`. The `ref` will be returned to allow you to change it later. */
  disableScaling?: MaybeRefOrGetter<boolean>;
  /** The scaling function to apply to the view when scrolling.   */
  scalingFunction?: (event: WheelEvent, graphTransform: GraphTransform) => GraphTransform;
}

export function defaultScalingFunction({ factor = 1e-3 }: { factor?: number }) {
  return function (event: WheelEvent, graphTransform: GraphTransform) {
    const { deltaY } = event;
    const scaleUp = Math.exp(deltaY * factor);
    const origin = screenToGraphPosition([event.offsetX, event.offsetY], graphTransform);
    const newTranslate = [(graphTransform.position[0] - origin[0]) * scaleUp + origin[0], (graphTransform.position[1] - origin[1]) * scaleUp + origin[1]] as Vec2;
    const newTransform = { position: newTranslate, scale: scaleUp * graphTransform.scale };
    return newTransform;
  };
}

export function useBackground({ backgroundGridPreset = presetBackgroundLineGrid({}), backgroundElement = useCurrentElement(), backgroundStyleBinding = true, graphTransform = inject(injectKeys.graphTransform), disableDragging = ref(false), disableScaling = ref(false), scalingFunction = defaultScalingFunction({}) }: UseBackgroundOptions) {
  if (!graphTransform?.value) {
    throw new Error("useBackground requires graphTransform to be provided. You should either provide it manually or call `useBackground` inside a component whose parent has `defineGraph` called.");
  }
  const isDragging = ref(false);
  const backgroundStyle = backgroundGridPreset(graphTransform, isDragging);
  const { style } = useElementStyle(backgroundElement);
  watch(
    backgroundStyle,
    (value) => {
      if (toValue(backgroundStyleBinding)) {
        Object.assign(style, value);
      }
    },
    { immediate: true }
  );
  const lastMousePosition = ref([0, 0] as Vec2);
  useEventListener(backgroundElement, "mousedown", (event) => {
    if (event.button === 0 && !toValue(disableDragging) && event.target === toValue(backgroundElement)) {
      lastMousePosition.value = [event.offsetX, event.offsetY];
      isDragging.value = true;
    }
  });
  useEventListener(backgroundElement, "mouseup", (event) => {
    if (event.button === 0) {
      isDragging.value = false;
    }
  });
  useEventListener(backgroundElement, "mousemove", (event) => {
    if (isDragging.value && !toValue(disableDragging) && event.target === toValue(backgroundElement)) {
      let delta = [event.offsetX - lastMousePosition.value[0], event.offsetY - lastMousePosition.value[1]];
      delta = [delta[0] * toValue(graphTransform).scale, delta[1] * toValue(graphTransform).scale];
      toValue(graphTransform).position = [toValue(graphTransform).position[0] - delta[0], toValue(graphTransform).position[1] - delta[1]];
      lastMousePosition.value = [event.offsetX, event.offsetY];
    }
  });
  useEventListener(backgroundElement, "wheel", async (event) => {
    if (!toValue(disableScaling)) {
      graphTransform.value = scalingFunction(event, toValue(graphTransform));
    }
  });

  return { backgroundStyle, isDragging, disableDragging, disableScaling };
}
