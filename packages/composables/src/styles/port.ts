import { useCurrentElement, watchImmediate } from "@vueuse/core";
import { useElementStyle } from "@vueuse/motion";
import { Property } from "csstype";
import { useLinksManager } from "../link";
import { computed, CSSProperties, MaybeRef, toRef, toValue } from "vue";

export interface UsePortStyleOptions {
  el?: MaybeRef<HTMLElement | null>;
  size?: MaybeRef<CSSProperties["width"] | number>;
  color?: MaybeRef<CSSProperties["backgroundColor"]>;
  borderColor?: MaybeRef<CSSProperties["borderColor"]>;
  borderWidth?: MaybeRef<CSSProperties["borderWidth"]>;
  borderStyle?: MaybeRef<CSSProperties["borderStyle"]>;
  side?: MaybeRef<"in" | "out" | undefined>;
  styleBinding?: MaybeRef<boolean>;
  cursor?: MaybeRef<Property.Cursor>;
  invalidCursor?: MaybeRef<Property.Cursor>;
}

export function usePortStyle({ el = useCurrentElement(), size = "8px", color = "#ee0000", borderColor = "#000", borderWidth = "1px", side, styleBinding = true, borderStyle = "solid", cursor = "crosshair", invalidCursor = "not-allowed" }: UsePortStyleOptions) {
  const { isLinkable, isLinking } = useLinksManager()!;
  const computedStyle = computed(
    () =>
      ({
        width: typeof size === "number" ? toValue(size) + "px" : toValue(size),
        height: typeof size === "number" ? toValue(size) + "px" : toValue(size),
        backgroundColor: toValue(color),
        borderColor: toValue(borderColor),
        borderWidth: toValue(borderWidth),
        borderStyle: toValue(borderStyle),
        left: toValue(side) === "in" ? "0" : undefined,
        right: toValue(side) === "out" ? "0" : undefined,
        transform: (toValue(side) === "in" ? "translateX(-50%)" : toValue(side) === "out" ? "translateX(50%)" : undefined) + "translateY(-50%)",
        top: "50%",
        cursor: toValue(isLinking) && !toValue(isLinkable) ? toValue(invalidCursor) : toValue(cursor),
        position: "absolute",
        borderRadius: "50%",
        transition: "all 0.1s ease",
      }) as CSSProperties
  );
  const { style } = useElementStyle(toRef(el));
  watchImmediate(computedStyle, (value) => {
    if (toValue(styleBinding)) {
      Object.assign(style, value);
    }
  });
  return computedStyle;
}
