import { Property } from "csstype";
import { MaybeRef, Ref, toRef, computed, CSSProperties, toValue } from "vue";
import { useElementStyle } from "@vueuse/motion";
import { graphToScreenPosition, GraphTransform } from "../graph";
import { watchImmediate } from "@vueuse/core";

export interface UseNodeStyleOptions {
  el: MaybeRef<HTMLElement | null>;
  position: Ref<[number, number]>;
  styleBinding: MaybeRef<boolean>;
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
  watchImmediate(computedStyles, (value) => {
    if (toValue(styleBinding)) {
      Object.assign(style, value);
    }
  });

  return computedStyles;
}

export interface UseHandlerStyleOptions {
  handler: MaybeRef<HTMLElement | null>;
  isDragging: Ref<boolean>;
  cursorNormal?: MaybeRef<Property.Cursor>;
  cursorGrab?: MaybeRef<Property.Cursor | boolean>;
  styleBinding?: MaybeRef<boolean>;
}

export function useHandlerStyle({ handler, isDragging, cursorNormal, cursorGrab = true, styleBinding }: UseHandlerStyleOptions) {
  const { style } = useElementStyle(toRef(handler));
  cursorNormal = computed(() => toValue(cursorNormal) || "grab");
  const newCursorGrab = computed(() => (toValue(cursorGrab) === true ? "grabbing" : toValue(cursorGrab) || toValue(cursorNormal)));

  const computedStyles = computed(() => {
    return {
      userSelect: "none",
      cursor: toValue(isDragging) ? toValue(newCursorGrab) : toValue(cursorNormal),
    } as CSSProperties;
  });

  watchImmediate(computedStyles, (value) => {
    if (toValue(styleBinding)) {
      Object.assign(style, value);
    }
  });

  return computedStyles;
}
