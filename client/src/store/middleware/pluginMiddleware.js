import pluginRegistry from "services/plugin/registry";

export default function pluginMiddleware({ dispatchIgnored, getStateIgnored }) {
  return next => action => {
    let adjustedAction = action;

    if (action.type === "REGISTER_COMPONENT") {
      const payload = { ...action.payload };
      const { component } = payload;
      const id = pluginRegistry.add(component);

      payload.id = id;
      payload.component =
        component.displayName || component.name || "unnamedComponent";
      adjustedAction = { ...action, payload };
    }

    return next(adjustedAction);
  };
}
