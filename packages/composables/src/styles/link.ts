import { computedWithControl, injectLocal, useIntervalFn, useMouse } from "@vueuse/core";
import { Vec2 } from "../graph";
import injectKeys from "../injectKeys";
import { ILink, populateLink, useLinksManager } from "../link";
import { computed, MaybeRefOrGetter, Ref, toValue, UnwrapRef } from "vue";
import { INode } from "src/node";
import { IPort } from "src/port";

export interface LinkRendererOptions {
  tension?: MaybeRefOrGetter<number>;
  customRender?: (a: Vec2, b: Vec2) => string;
}

function createDefaultRender(tension: MaybeRefOrGetter<number>) {
  const render = function ([x1, y1]: Vec2, [x2, y2]: Vec2, tension = 0.5) {
    const control1 = [x1 + tension * (x2 - x1), y1];
    const control2 = [x2 - tension * (x2 - x1), y2];
    return `M ${x1} ${y1} C ${control1[0]} ${control1[1]} ${control2[0]} ${control2[1]} ${x2} ${y2}`;
  };
  return (a: Vec2, b: Vec2) => render(a, b, toValue(tension));
}
const { x: xm, y: ym } = useMouse();
function getElementCenter(el: HTMLElement) {
  const { x, y } = el.getBoundingClientRect();
  return [x + el.clientWidth / 2, y + el.clientHeight / 2] as Vec2;
}
export function renderLink(link: ILink, { nodes, ports, customRender, tension = 0.5 }: LinkRendererOptions & { nodes: Ref<UnwrapRef<INode>[]>; ports: Ref<UnwrapRef<IPort>[]> }) {
  const { sourcePort, targetPort } = populateLink(link, { nodes, ports });
  const sourcePortEl = toValue(toValue(sourcePort)?.el);
  const targetPortEl = toValue(toValue(targetPort)?.el);
  const sourceScreenPosition = (() => {
    if (sourcePortEl) {
      return getElementCenter(sourcePortEl);
    } else {
      return [xm.value, ym.value] as Vec2;
    }
  })();
  const targetScreenPosition = (() => {
    if (targetPortEl) {
      return getElementCenter(targetPortEl);
    } else {
      return [xm.value, ym.value] as Vec2;
    }
  })();
  const render = customRender || createDefaultRender(tension);
  return render(sourceScreenPosition, targetScreenPosition);
}

export function renderLinks({ ...options }: LinkRendererOptions) {
  const links = injectLocal(injectKeys.links);
  const nodes = injectLocal(injectKeys.nodes);
  useIntervalFn(() => {
    pathes.trigger();
  }, 1000 / 60);
  const ports = computed(() => {
    return toValue(nodes)!
      .map((node) => toValue(node.ports))
      .flat();
  });
  if (!links || !nodes) {
    throw new Error("`renderLinks` requires `defineGraph` to be called at a parent component.");
  }
  const pathes = computedWithControl([], () => {
    return toValue(links).map((link) => ({
      link,
      d: toValue(renderLink(link, { ...options, nodes, ports })),
    }));
  });

  return { pathes, ...useLinksManager() };
}
