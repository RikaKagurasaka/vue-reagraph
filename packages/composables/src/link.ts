import { createSharedComposable, injectLocal, MaybeRefOrGetter, toReactive, useMemoize, useMousePressed } from "@vueuse/core";
import { computed, nextTick, ref, Ref, toValue, UnwrapRef, watch } from "vue";
import { INode } from "./node";
import { IPort } from "./port";
import injectKeys from "./injectKeys";

export interface ILink {
  sourceNodeId: MaybeRefOrGetter<string>;
  sourcePortId: MaybeRefOrGetter<string>;
  targetNodeId: MaybeRefOrGetter<string> | null;
  targetPortId: MaybeRefOrGetter<string> | null;
}
export function populateLink(link: MaybeRefOrGetter<ILink>, { nodes, ports }: { nodes: Ref<UnwrapRef<INode>[]>; ports: Ref<UnwrapRef<IPort>[]> }) {
  if (!nodes || !ports) {
    throw new Error("`_populateLink` requires proper injection of nodes and ports.");
  }
  const sourceNode = computed(() => nodes.value.find((n) => toValue(n.uuid) === toValue(toValue(link).sourceNodeId)));
  const targetNode = computed(() => nodes.value.find((n) => toValue(n.uuid) === toValue(toValue(link).targetNodeId)));
  const sourcePort = computed(() => ports.value.find((p) => toValue(p.id) === toValue(toValue(link).sourcePortId) && toValue(p.nodeId) === toValue(toValue(sourceNode)?.uuid)));
  const targetPort = computed(() => ports.value.find((p) => toValue(p.id) === toValue(toValue(link).targetPortId) && toValue(p.nodeId) === toValue(toValue(targetNode)?.uuid)));

  return { sourceNode, sourcePort, targetNode, targetPort };
}

export function linkToKey(link: MaybeRefOrGetter<ILink>) {
  return `${toValue(toValue(link).sourceNodeId)}-${toValue(toValue(link).sourcePortId)}-${toValue(toValue(link).targetNodeId)}-${toValue(toValue(link).targetPortId)}`;
}
const defaultCheckLinkable = ({ sourceNodeId, sourcePortId, targetNodeId, targetPortId }: ILink) => !!sourceNodeId && !!sourcePortId && !!targetNodeId && !!targetPortId && !(sourceNodeId === targetNodeId && sourcePortId === targetPortId);

function defineLinksManager(options?: { checkLinkable?: (link: ILink) => boolean }) {
  const checkLinkable = useMemoize(options?.checkLinkable || defaultCheckLinkable);
  const links = injectLocal(injectKeys.links)!;
  const nodes = injectLocal(injectKeys.nodes)!;
  if (!toValue(links) || !toValue(nodes)) {
    throw new Error("`defineLinksManager` requires proper injection of links and nodes.");
  }
  const danglingLink = computed(() => links.value.find((l) => !toValue(l.targetNodeId) || !toValue(l.targetPortId)));
  const mouseOverPort = ref<IPort | null>(null);
  const mouseOverNode = ref<INode | null>(null);
  const mouseOverLink = computed(() => ({ ...toValue(danglingLink)!, targetNodeId: toValue(mouseOverNode)?.uuid || null, targetPortId: mouseOverPort.value?.id || null }));
  const { pressed } = useMousePressed();
  const isLinking = computed(() => !!toValue(danglingLink));
  const isLinkable = computed(() => isLinking.value && toValue(mouseOverPort.value) && toValue(danglingLink) && checkLinkable(toValue(mouseOverLink)!));
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

  return { onPortMouseDown, onPortMouseUp, onPortMouseMove, isLinking, isLinkable, mouseOverPort, danglingLink, links };
}
export const useLinksManager = createSharedComposable(defineLinksManager);
