import plugins from "plugins";
import isFunction from "lodash/isFunction";

class PluginInitializer {
  initialize(store) {
    // Plugins are initialized at runtime.
    Object.values(plugins).forEach(initialize => {
      if (isFunction(initialize)) {
        initialize(store);
      }
    });
  }
}

export default new PluginInitializer();
