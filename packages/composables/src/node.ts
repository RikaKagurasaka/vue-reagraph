import { injectLocal, MaybeComputedElementRef, useCurrentElement } from "@vueuse/core";
import { isRef, MaybeRefOrGetter, onBeforeUnmount, onMounted, provide, Ref, ref, toValue } from "vue";
import { v4 } from "uuid";
import injectKeys from "./injectKeys";
import { ILink } from "./link";
export interface INode {
  uuid: MaybeRefOrGetter<string>;
  position: Ref<[number, number]>;
  el: MaybeComputedElementRef;
}

export interface DefineNodeOptions {
  uuid?: MaybeRefOrGetter<string>;
  position: MaybeRefOrGetter<[number, number]>;
  el?: MaybeComputedElementRef;
}

export function defineNode({ uuid = ref(v4()), position: posiiton_, el = useCurrentElement() }: DefineNodeOptions): INode {
  const position = isRef(posiiton_) ? posiiton_ : ref(toValue(posiiton_));
  const nodes = injectLocal(injectKeys.nodes) as Ref<INode[]> | undefined;
  const links = injectLocal(injectKeys.links) as Ref<ILink[]> | undefined;
  if (!nodes) {
    console.error("`defineNode` requires `defineGraph` to be called at a parent component.");
  }
  if (!links) {
    console.error("`defineNode` requires `defineGraph` to be called at a parent component.");
  }
  onMounted(() => {
    if (nodes) {
      nodes.value.push(node);
    }
  });
  onBeforeUnmount(() => {
    if (nodes) {
      const index = nodes.value.indexOf(node);
      if (index !== -1) {
        nodes.value.splice(index, 1);
      }
    }
  });
  const node = { uuid, position, el };
  provide(injectKeys.node, node);
  return node;
}
