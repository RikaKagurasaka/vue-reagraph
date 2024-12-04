import { MaybeComputedElementRef, useCurrentElement } from "@vueuse/core";
import { MaybeRefOrGetter } from "vue";

export interface DefinePortOptions {
  id: MaybeRefOrGetter<string>;
  el?: MaybeComputedElementRef;
}

export function definePort({ id, el = useCurrentElement() }: DefinePortOptions) {
  return { id, el };
}
