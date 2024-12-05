import { Property } from "csstype";
import { MaybeRefOrGetter, Ref, toRef, computed, CSSProperties, watch, toValue } from "vue";
import { useElementStyle } from "@vueuse/motion";
import { graphToScreenPosition, GraphTransform } from "../graph";

export interface UseNodeStyleOptions {
  el: MaybeRefOrGetter<HTMLElement | null>;
  position: Ref<[number, number]>;
  styleBinding: MaybeRefOrGetter<boolean>;
  graphTransform: Ref<GraphTransform>;
}

export function useNodeStyle({ el, position, styleBinding, graphTransform }: UseNodeStyleOptions) {
  const { style } = useElementStyle(toRef(el));
  const computedStyles = computed(() => {
    const screenPosition = graphToScreenPosition(toValue(position), toValue(graphTransform));
    return {
      position: "absolute",
      left: `${screenPosition[0]}px`,
      top: `${screenPosition[1]}px`,
      scale: 1 / toValue(graphTransform).scale,
      transformOrigin: `0 0`,
    } as CSSProperties;
  });
  watch(
    computedStyles,
    (value) => {
      if (toValue(styleBinding)) {
        Object.assign(style, value);
      }
    },
    { immediate: true }
  );

  return computedStyles;
}

export interface UseHandlerStyleOptions {
  handler: MaybeRefOrGetter<HTMLElement | null>;
  isDragging: Ref<boolean>;
  cursorNormal?: MaybeRefOrGetter<Property.Cursor>;
  cursorGrab?: MaybeRefOrGetter<Property.Cursor | boolean>;
  styleBinding?: MaybeRefOrGetter<boolean>;
}

export function useHandlerStyle({ handler, isDragging, cursorNormal, cursorGrab = true, styleBinding = true }: UseHandlerStyleOptions) {
  const { style } = useElementStyle(toRef(handler));
  cursorNormal = computed(() => toValue(cursorNormal) || "grab");
  const newCursorGrab = computed(() => (toValue(cursorGrab) === true ? "grabbing" : toValue(cursorGrab) || toValue(cursorNormal)));

  const computedStyles = computed(() => {
    return {
      cursor: toValue(isDragging) ? toValue(newCursorGrab) : toValue(cursorNormal),
    } as CSSProperties;
  });

  watch(
    computedStyles,
    (value) => {
      if (toValue(styleBinding)) {
        Object.assign(style, value);
      }
    },
    { immediate: true }
  );

  return computedStyles;
}

