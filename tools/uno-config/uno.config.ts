import { presetIcons, presetUno, transformerDirectives } from "unocss";
export default {
  presets: [presetUno(), presetIcons()],
  transformers: [transformerDirectives()],
};
