import { computed, ComputedRef, MaybeRefOrGetter, toValue } from "vue";
import { Property } from "csstype";
export type BackgroundGridFunction = (transform: MaybeRefOrGetter<{ position: [number, number]; scale: number }>, isDragging: MaybeRefOrGetter<boolean>) => ComputedRef<{ backgroundImage: string; backgroundSize: string; backgroundPosition: string }>;

type CommonStyleConfig = {
  cellSize?: MaybeRefOrGetter<number>;
  backgroundColor?: MaybeRefOrGetter<string>;
  color?: MaybeRefOrGetter<string>;
  theme?: MaybeRefOrGetter<"dark" | "light">;
  cursorNormal?: MaybeRefOrGetter<Property.Cursor>;
  cursorGrab?: MaybeRefOrGetter<Property.Cursor | boolean>;
};

const themes = {
  dark: {
    backgroundColor: "#1e1e1e",
    color: "#7773",
  },
  light: {
    backgroundColor: "#f6f6f6",
    color: "#7773",
  },
};
const defaultTheme = "light";

export function presetBackgroundLineGrid({ cellSize = 50, backgroundColor, color, theme = defaultTheme, cursorNormal, cursorGrab = true, thickness = 1 }: CommonStyleConfig & { thickness?: MaybeRefOrGetter<number> }) {
  backgroundColor = computed(() => toValue(backgroundColor) || themes[toValue(theme)].backgroundColor);
  color = computed(() => toValue(color) || themes[toValue(theme)].color);
  cursorNormal = computed(() => toValue(cursorNormal) || "default");
  const newCursorGrab = computed(() => (toValue(cursorGrab) === true ? "grabbing" : toValue(cursorGrab) || "default"));
  return function (transform: MaybeRefOrGetter<{ position: [number, number]; scale: number }>, isDragging: MaybeRefOrGetter<boolean>) {
    return computed(() => {
      const cellSize_ = toValue(cellSize) / toValue(transform).scale;
      return {
        cursor: toValue(isDragging) ? toValue(newCursorGrab) : toValue(cursorNormal),
        backgroundColor: toValue(backgroundColor),
        backgroundImage: `repeating-linear-gradient(to right, ${toValue(color)} 0px, ${toValue(color)} ${thickness}px, transparent ${thickness}px, transparent ${cellSize_}px), 
        repeating-linear-gradient(to bottom, ${toValue(color)} 0px, ${toValue(color)} ${thickness}px, transparent ${thickness}px, transparent ${cellSize_}px)`,
        backgroundSize: `${cellSize_}px ${cellSize_}px`,
        backgroundPosition: `${-toValue(transform).position[0] % cellSize_}px ${-toValue(transform).position[1] % cellSize_}px`,
      };
    });
  } as BackgroundGridFunction;
}

export function presetBackgroundDotGrid({ cellSize = 50, backgroundColor, color, theme = defaultTheme, cursorNormal, cursorGrab = true, radius = 2 }: CommonStyleConfig & { radius?: MaybeRefOrGetter<number> }) {
  backgroundColor = computed(() => toValue(backgroundColor) || themes[toValue(theme)].backgroundColor);
  color = computed(() => toValue(color) || themes[toValue(theme)].color);
  cursorNormal = computed(() => toValue(cursorNormal) || "default");
  const newCursorGrab = computed(() => (toValue(cursorGrab) === true ? "grabbing" : toValue(cursorGrab) || "default"));

  return function (transform: MaybeRefOrGetter<{ position: [number, number]; scale: number }>, isDragging: MaybeRefOrGetter<boolean>) {
    return computed(() => {
      const cellSize_ = toValue(cellSize) / toValue(transform).scale;
      return {
        cursor: toValue(isDragging) ? toValue(newCursorGrab) : toValue(cursorNormal),
        backgroundColor: toValue(backgroundColor),
        backgroundImage: `radial-gradient(circle, ${toValue(color)} ${toValue(radius)}px, transparent ${toValue(radius)}px)`,
        backgroundSize: `${cellSize_}px ${cellSize_}px`,
        backgroundPosition: `${-toValue(transform).position[0] % cellSize_}px ${-toValue(transform).position[1] % cellSize_}px`,
      };
    });
  };
}
