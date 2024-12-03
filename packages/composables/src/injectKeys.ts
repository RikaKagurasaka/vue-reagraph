import { InjectionKey, ref, Ref } from "vue";
import { GraphTransform } from "./graph";

export default {
    graphTransform: Symbol("graphTransform") as InjectionKey<Ref<GraphTransform>>,
}