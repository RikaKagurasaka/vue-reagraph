import { computedWithControl, useIntervalFn, useMouse } from "@vueuse/core";
import { Vec2 } from "../graph";
import { useLink } from "../link";
import { computed, MaybeRef, toValue } from "vue";

function getElementCenter(el: HTMLElement) {
  const { x, y, width, height } = el.getBoundingClientRect();
  return [x + width / 2, y + height / 2] as Vec2;
}
const mouse = useMouse();

export function presetLinkPathDefault(tension: MaybeRef<number>) {
  const { sourcePort, targetPort } = useLink()!;
  const sourcePos = computedWithControl([() => sourcePort.value?.el?.getBoundingClientRect()], () => (toValue(sourcePort)?.el ? getElementCenter(toValue(sourcePort)!.el!) : ([toValue(mouse.x), toValue(mouse.y)] as Vec2)));
  const targetPos = computedWithControl([() => targetPort.value?.el?.getBoundingClientRect()], () => (toValue(targetPort)?.el ? getElementCenter(toValue(targetPort)!.el!) : ([toValue(mouse.x), toValue(mouse.y)] as Vec2)));
  const control1 = computed(() => [sourcePos.value[0] + toValue(tension) * (targetPos.value[0] - sourcePos.value[0]), sourcePos.value[1]]);
  const control2 = computed(() => [targetPos.value[0] - toValue(tension) * (targetPos.value[0] - sourcePos.value[0]), targetPos.value[1]]);
  const computedPath = computedWithControl([], () => `M ${sourcePos.value[0]} ${sourcePos.value[1]} C ${control1.value[0]} ${control1.value[1]} ${control2.value[0]} ${control2.value[1]} ${targetPos.value[0]} ${targetPos.value[1]}`);
  useIntervalFn(() => {
    sourcePos.trigger();
    targetPos.trigger();
    computedPath.trigger();
  }, 1000 / 60);
  return computedPath;
}
