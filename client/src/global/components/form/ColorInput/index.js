import loadable from "@loadable/component";

const ColorInput = loadable(() =>
  import(/* webpackChunkName: "coloris" */ "./ColorInput")
);

export default ColorInput;
