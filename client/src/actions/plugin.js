import { createAction } from "redux-actions";

export const registerPlugin = createAction("REGISTER_PLUGIN", plugin => ({
  plugin
}));
export const registerComponent = createAction(
  "REGISTER_COMPONENT",
  (plugin, region, component) => ({ plugin, region, component })
);
