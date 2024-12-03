import { BackgroundGridFunction, presetBackgroundLineGrid } from "@vue-reagraph/styles";
import { useEventListener } from "@vueuse/core";
import { useElementStyle } from "@vueuse/motion";
import { MaybeRef, MaybeRefOrGetter, watch, toValue, ref, inject, Ref } from "vue";
import { Vec2 } from "./graph";
import injectKeys from "./injectKeys";

export interface UseBackgroundOptions {
  graphTransform?: Ref<{ position: [number, number]; scale: number }>;
  backgroundGridPreset?: BackgroundGridFunction;
  backgroundElement: MaybeRef<HTMLElement>;
  backgroundStyleBinding?: MaybeRefOrGetter<boolean>;
}

export function useBackground({ backgroundGridPreset = presetBackgroundLineGrid({}), backgroundElement, backgroundStyleBinding = true, graphTransform = inject(injectKeys.graphTransform) }: UseBackgroundOptions) {
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
  const disableDragging = ref(false);
  useEventListener(backgroundElement, "mousedown", (event) => {
    if (event.button === 0 && !disableDragging.value && event.target === toValue(backgroundElement)) {
      lastMousePosition.value = [event.clientX, event.clientY];
      isDragging.value = true;
    }
  });
  useEventListener(window, "mouseup", (event) => {
    if (event.button === 0 && event.target === toValue(backgroundElement)) {
      isDragging.value = false;
    }
  });
  useEventListener(window, "mousemove", (event) => {
    if (isDragging.value && !disableDragging.value && event.target === toValue(backgroundElement)) {
      let delta = [event.clientX - lastMousePosition.value[0], event.clientY - lastMousePosition.value[1]];
      delta = [delta[0] * graphTransform.value.scale, delta[1] * graphTransform.value.scale];
      graphTransform.value.position = [graphTransform.value.position[0] - delta[0], graphTransform.value.position[1] - delta[1]];
      lastMousePosition.value = [event.clientX, event.clientY];
    }
  });
  return { backgroundStyle, isDragging, disableDragging };
}
