import { InjectionKey } from "vue";
import { UseGraphRawReturn } from "./graph";
import { INode } from "./node";
import { UseLinkReturn, UseLinksManagerReturn } from "./link";
import { IPort } from "./port";
import { injectLocal, provideLocal } from "@vueuse/core";

export default {
  graphRaw: Symbol("graphRaw") as InjectionKey<UseGraphRawReturn>,
  graph: Symbol("graph") as InjectionKey<UseGraphRawReturn>,
  linksManager: Symbol("linksManager") as InjectionKey<UseLinksManagerReturn>,
  link: Symbol("link") as InjectionKey<UseLinkReturn>,
  node: Symbol("node") as InjectionKey<INode>,
  port: Symbol("port") as InjectionKey<IPort>,
};

export function createLocalInjectionState<TArgs extends unknown[], TReturn, TInjectionKey extends InjectionKey<TReturn>>(setup: (...args: TArgs) => TReturn, injectionKey: TInjectionKey) {
  const useProvidingState = (...args: TArgs) => {
    const state = setup(...args);
    provideLocal<TReturn>(injectionKey, state);
    return state;
  };
  const useInjectedState = () => injectLocal<TReturn>(injectionKey);
  return [useProvidingState, useInjectedState] as const;
}
