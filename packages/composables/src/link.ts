import { MaybeRef, toReactive, useCurrentElement, useEventListener, useMousePressed } from "@vueuse/core";
import { computed, ComputedRef, nextTick, ref, Ref, toRefs, toValue, UnwrapRef, watch } from "vue";
import { INode } from "./node";
import { IPort } from "./port";
import { useGraphRaw } from "./graph";
import injectKeys, { createLocalInjectionState } from "./injectKeys";

export interface ILink {
  sourceNodeId: MaybeRef<string>;
  sourcePortId: MaybeRef<string>;
  targetNodeId: MaybeRef<string> | null;
  targetPortId: MaybeRef<string> | null;
}
export function populateLink(link: ILink, { nodes, ports }: { nodes: Ref<UnwrapRef<INode>[]>; ports: Ref<UnwrapRef<IPort>[]> }) {
  if (!nodes || !ports) {
    throw new Error("`_populateLink` requires proper injection of nodes and ports.");
  }
  const sourceNode = computed(() => nodes.value.find((n) => toValue(n.uuid) === toValue(toValue(link).sourceNodeId)));
  const targetNode = computed(() => nodes.value.find((n) => toValue(n.uuid) === toValue(toValue(link).targetNodeId)));
  const sourcePort = computed(() => ports.value.find((p) => toValue(p.id) === toValue(toValue(link).sourcePortId) && toValue(p.nodeId) === toValue(toValue(sourceNode)?.uuid)));
  const targetPort = computed(() => ports.value.find((p) => toValue(p.id) === toValue(toValue(link).targetPortId) && toValue(p.nodeId) === toValue(toValue(targetNode)?.uuid)));

  return { sourceNode, sourcePort, targetNode, targetPort };
}

export function linkToKey(link: MaybeRef<ILink>) {
  return `${toValue(toValue(link).sourceNodeId)}-${toValue(toValue(link).sourcePortId)}-${toValue(toValue(link).targetNodeId)}-${toValue(toValue(link).targetPortId)}`;
}
export const checkLinkableCannotLinkSelf = ({ sourceNodeId, targetNodeId }: ILink) => !(sourceNodeId === targetNodeId);
export const checkLinkableCannotLinkRepeated = (link: ILink, links: ILink[]) => !links.some((l) => linkToKey(l) === linkToKey(link));
export const checkLinkableCannotConflictDirection = (link: ILink) => {
  const { sourcePortId, targetPortId } = link;
  if (!toValue(targetPortId)) return true;
  const sourcePortDirection = toValue(sourcePortId)!.includes("-in") ? "negative" : toValue(sourcePortId)!.includes("-out") ? "positive" : "none";
  const targetPortDirection = toValue(targetPortId)!.includes("-in") ? "positive" : toValue(targetPortId)!.includes("-out") ? "negative" : "none";
  if (sourcePortDirection === "none" || targetPortDirection === "none") return true;
  return sourcePortDirection === targetPortDirection;
};
const defaultCheckLinkable = (link: ILink, _nodes: UnwrapRef<INode>[], links: UnwrapRef<ILink>[]) => {
  const cannotLinkSelf = checkLinkableCannotLinkSelf(link);
  const cannotLinkRepeated = checkLinkableCannotLinkRepeated(link, links);
  const cannotConflictDirection = checkLinkableCannotConflictDirection(link);
  return cannotLinkSelf && cannotLinkRepeated && cannotConflictDirection;
};

function _defineLinksManager(options?: { checkLinkable?: (link: ILink, nodes: UnwrapRef<INode>[], links: UnwrapRef<ILink>[]) => boolean }) {
  const checkLinkable = options?.checkLinkable || defaultCheckLinkable;
  const { links, nodes } = useGraphRaw()!;
  const danglingLink = computed(() => links.value.find((l) => !toValue(l.targetNodeId) || !toValue(l.targetPortId)));
  const mouseOverPort = ref<IPort | null>(null);
  const mouseOverNode = ref<INode | null>(null);
  const mouseOverLink = computed(() => ({ ...toValue(danglingLink)!, targetNodeId: toValue(mouseOverNode)?.uuid || null, targetPortId: mouseOverPort.value?.id || null }));
  const { pressed } = useMousePressed();
  const isLinking = computed(() => !!toValue(danglingLink));
  const isLinkable = computed(() => isLinking.value && toValue(mouseOverPort.value) && toValue(danglingLink) && checkLinkable(toValue(mouseOverLink)!, nodes.value, links.value));

  watch(pressed, async () => {
    await nextTick();
    if (!pressed.value) {
      mouseOverPort.value = null;
      mouseOverNode.value = null;
      clearDanglingLinks();
    }
  });
  function clearDanglingLinks() {
    links.value = links.value.filter((l) => toValue(l.targetNodeId) && toValue(l.targetPortId));
  }
  function appendLink(link: ILink) {
    links.value = [...links.value, toReactive(link)];
  }
  function onPortMouseDown(_event: MouseEvent, port: IPort, node: INode) {
    clearDanglingLinks();
    const link = { sourceNodeId: toValue(node.uuid), sourcePortId: toValue(port.id), targetNodeId: null, targetPortId: null };
    appendLink(link);
    mouseOverPort.value = port;
    mouseOverNode.value = node;
  }
  function onPortMouseUp(_event: MouseEvent, port: IPort, node: INode) {
    mouseOverPort.value = port;
    mouseOverNode.value = node;
    if (!toValue(isLinking)) return;
    if (toValue(isLinkable)) {
      appendLink(toValue(mouseOverLink)!);
    }
    mouseOverPort.value = null;
    mouseOverNode.value = null;
    clearDanglingLinks();
  }
  function onPortMouseMove(_event: MouseEvent, port: IPort, node: INode) {
    if (!toValue(isLinking)) return;
    mouseOverPort.value = port;
    mouseOverNode.value = node;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function onPortMouseLeave(_event: MouseEvent, port: IPort, node: INode) {
    mouseOverPort.value = null;
    mouseOverNode.value = null;
  }

  return { onPortMouseDown, onPortMouseUp, onPortMouseMove, onPortMouseLeave, isLinking, isLinkable, mouseOverPort, danglingLink, links };
}
export const [defineLinksManager, useLinksManager] = createLocalInjectionState(_defineLinksManager, injectKeys.linksManager);
export interface UseLinksManagerOptions {
  checkLinkable?: (link: ILink, nodes: UnwrapRef<INode>[], links: UnwrapRef<ILink>[]) => boolean;
}
export interface UseLinksManagerReturn {
  onPortMouseDown: (event: MouseEvent, port: IPort, node: INode) => void;
  onPortMouseUp: (event: MouseEvent, port: IPort, node: INode) => void;
  onPortMouseMove: (event: MouseEvent, port: IPort, node: INode) => void;
  isLinking: ComputedRef<boolean>;
  isLinkable: ComputedRef<boolean | null | undefined>;
}

function _defineLink(link: ILink) {
  const { nodes, ports } = useGraphRaw()!;
  const { sourceNode, sourcePort, targetNode, targetPort } = populateLink(link, { nodes, ports });
  const direction = computed(() => {
    if (toValue(sourcePort)?.id.includes("-out")) {
      if (!toValue(targetPort) || toValue(targetPort)?.id.includes("-in")) return "positive";
      return "none";
    }
    if (toValue(sourcePort)?.id.includes("-in")) {
      if (!toValue(targetPort) || toValue(targetPort)?.id.includes("-out")) return "negative";
      return "none";
    }
    return "none";
  });
  const isDangling = computed(() => !toValue(targetPort));
  return { sourceNode, sourcePort, targetNode, targetPort, direction, isDangling, link };
}
export interface UseLinkReturn {
  sourceNode: ComputedRef<INode | null>;
  sourcePort: ComputedRef<IPort | null>;
  targetNode: ComputedRef<INode | null>;
  targetPort: ComputedRef<IPort | null>;
  direction: ComputedRef<"positive" | "negative" | "none">;
  isDangling: ComputedRef<boolean>;
}
const [defineLinkRaw, useLinkRaw] = createLocalInjectionState(_defineLink, injectKeys.link);
export const defineLink = (link: ILink, options?: UseBreakableLinkOptions & { linksBreakable?: MaybeRef<boolean> }) => {
  const { linksBreakable = true } = options || {};
  const linkRaw = defineLinkRaw(link);
  if (toValue(linksBreakable)) {
    useBreakableLink(options);
  }
  return linkRaw;
};
export const useLink = () => useLinkRaw();

function revertLink(link: ILink) {
  const { sourceNodeId, sourcePortId, targetNodeId, targetPortId } = toRefs(link);
  if (!toValue(sourceNodeId) || !toValue(sourcePortId) || !toValue(targetNodeId) || !toValue(targetPortId)) return;
  sourceNodeId.value = toValue(targetNodeId)!;
  sourcePortId.value = toValue(targetPortId)!;
  targetNodeId.value = toValue(sourceNodeId)!;
  targetPortId.value = toValue(sourcePortId)!;
}

function mousePortDistance(portElement: HTMLElement, event: MouseEvent) {
  const { x, y } = event;
  const { x: portX, y: portY, width, height } = portElement.getBoundingClientRect();
  const centerX = portX + width / 2;
  const centerY = portY + height / 2;
  return Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
}
interface UseBreakableLinkOptions {
  pathElement?: MaybeRef<SVGPathElement>;
}
function useBreakableLink(options?: UseBreakableLinkOptions) {
  const { pathElement = useCurrentElement<SVGPathElement>() } = options || {};
  const { sourcePort, targetPort, isDangling, link } = useLink()!;
  useEventListener(pathElement, "mousedown", (event: MouseEvent) => {
    if (isDangling.value) return;
    const distanceSource = mousePortDistance(toValue(sourcePort)!.el!, event);
    const distanceTarget = mousePortDistance(toValue(targetPort)!.el!, event);
    if (distanceSource < distanceTarget) {
      revertLink(link);
    }
    toRefs(link).targetNodeId.value = null;
    toRefs(link).targetPortId.value = null;
  });
}
