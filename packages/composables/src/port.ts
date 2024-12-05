import { injectLocal, useCurrentElement } from "@vueuse/core";
import { MaybeRefOrGetter, onBeforeUnmount, onMounted, Ref, toRef, toValue } from "vue";
import injectKeys from "./injectKeys";

export interface IPort {
  id: Ref<string>;
  el: Ref<HTMLElement | null>;
}

export interface DefinePortOptions {
  id: MaybeRefOrGetter<string>;
  el?: MaybeRefOrGetter<HTMLElement | null>;
}

export function definePort({ id, el = useCurrentElement() }: DefinePortOptions) {
  const ports = injectLocal(injectKeys.ports) as Ref<IPort[]> | undefined;
  if (!ports) {
    throw new Error("`definePort` requires `defineNode` to be called at a parent component.");
  }
  const port = { id: toRef(id), el: toRef(el) };
  onMounted(() => {
    if (toValue(ports).find((p) => toValue(p.id) === toValue(id))) {
      console.warn(`Port with id ${toValue(id)} already exists. Is id duplicate or the onMounted hook called multiple times?`);
    } else {
      ports.value.push(port);
    }
  });
  onBeforeUnmount(() => {
    ports.value = ports.value.filter((p) => toValue(p.id) !== toValue(id));
  });
  return port;
}
