import { toReactive } from "@vueuse/core";
import { useGraphRaw } from "./graph";
import { ILink } from "./link";
import { INode } from "./node";
import { UnwrapRef } from "vue";

export function useNodesMethods() {
  const { nodes } = useGraphRaw()!;
  function getNode(uuid: string) {
    return nodes.value.find((node) => node.uuid === uuid);
  }
  function addNode(node: INode) {
    nodes.value = [...nodes.value, toReactive(node)];
  }
  function removeNode(uuid: string) {
    const index = nodes.value.findIndex((node) => node.uuid === uuid);
    if (index !== -1) {
      nodes.value = nodes.value.filter((node) => node.uuid !== uuid);
    }
  }
  return { getNode, addNode, removeNode };
}

export function useLinksMethods() {
  const { links } = useGraphRaw()!;

  function findLinks(search: Partial<UnwrapRef<ILink>>, predictor: (link: UnwrapRef<ILink>) => boolean = () => true) {
    const result: UnwrapRef<ILink>[] = [];
    for (const l of links.value as UnwrapRef<ILink>[]) {
      if (Object.keys(search).every((key) => l[key as keyof UnwrapRef<ILink>] === search[key as keyof UnwrapRef<ILink>]) && predictor(l)) result.push(l);
    }
    return result;
  }

  function findLink(link: Partial<UnwrapRef<ILink>>, predictor: (link: UnwrapRef<ILink>) => boolean = () => true) {
    return findLinks(link, predictor)[0];
  }

  function addLink(link: UnwrapRef<ILink>) {
    links.value = [...links.value, toReactive(link)];
  }

  function removeLink(link: UnwrapRef<ILink>) {
    links.value = links.value.filter((l) => l !== link);
  }

  return { findLinks, addLink, removeLink, findLink };
}
