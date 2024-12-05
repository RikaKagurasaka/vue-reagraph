import { useCurrentElement } from "@vueuse/core";
import { useElementStyle } from "@vueuse/motion";
import { Property } from "csstype";
import { computed, CSSProperties, MaybeRefOrGetter, toRef, toValue, watch } from "vue";

export interface UsePortStyleOptions {
  el?: MaybeRefOrGetter<HTMLElement | null>;
  size?: MaybeRefOrGetter<CSSProperties["width"] | number>;
  color?: MaybeRefOrGetter<CSSProperties["backgroundColor"]>;
  borderColor?: MaybeRefOrGetter<CSSProperties["borderColor"]>;
  borderWidth?: MaybeRefOrGetter<CSSProperties["borderWidth"]>;
  borderStyle?: MaybeRefOrGetter<CSSProperties["borderStyle"]>;
  side?: MaybeRefOrGetter<"left" | "right" | undefined>;
  styleBinding?: MaybeRefOrGetter<boolean>;
  cursor?: MaybeRefOrGetter<Property.Cursor>;
}

export function usePortStyle({ el = useCurrentElement(), size = "8px", color = "#ee0000", borderColor = "#000", borderWidth = "1px", side, styleBinding = true, borderStyle = "solid", cursor = "crosshair" }: UsePortStyleOptions) {
  const computedStyle = computed(
    () =>
      ({
        width: typeof size === "number" ? toValue(size) + "px" : toValue(size),
        height: typeof size === "number" ? toValue(size) + "px" : toValue(size),
        backgroundColor: toValue(color),
        borderColor: toValue(borderColor),
        borderWidth: toValue(borderWidth),
        borderStyle: toValue(borderStyle),
        left: toValue(side) === "left" ? "0" : undefined,
        right: toValue(side) === "right" ? "0" : undefined,
        transform: (toValue(side) === "left" ? "translateX(-50%)" : toValue(side) === "right" ? "translateX(50%)" : undefined) + "translateY(-50%)",
        top: "50%",
        cursor: toValue(cursor),
        position: "absolute",
        borderRadius: "50%",
      }) as CSSProperties
  );
  const { style } = useElementStyle(toRef(el));
  watch(
    computedStyle,
    (value) => {
      if (styleBinding) {
        Object.assign(style, value);
      }
    },
    { immediate: true }
  );
  return computedStyle;
}
