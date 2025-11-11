import isFunction from "lodash/isFunction";
import isObject from "lodash/isObject";
import isArray from "lodash/isArray";
import forEach from "lodash/forEach";

class LinkHandler {
  constructor() {
    this.handlers = null;
    this.routes = null;
    this._registeredRoutes = null;
  }

  // Register routes (called after routes are created)
  // This breaks the circular dependency since routes are registered
  // after all modules are loaded, not during module evaluation
  registerRoutes(routes) {
    this._registeredRoutes = routes;
    // Reset handlers/routes so they'll be rebuilt on next access
    // this.handlers = null;
    // this.routes = null;
  }

  extract(route) {
    if (!route) return;
    const { children, handle } = route;
    const { name, helper, helpers } = handle ?? {};

    if (name) {
      if (isFunction(helper)) this.handlers[name] = helper;
    }
    if (isObject(helpers)) {
      forEach(helpers, (value, key) => {
        this.handlers[key] = value;
      });
    }
    if (isArray(children)) {
      children.forEach(child => {
        this.extract(child);
      });
    }
    if (name) {
      this.routes[name] = route;
    }
  }

  setup() {
    this.handlers = {};
    this.routes = {};

    // Use registered routes instead of importing
    const routesToProcess = this._registeredRoutes;
    if (routesToProcess && isArray(routesToProcess)) {
      routesToProcess.forEach(route => {
        this.extract(route);
      });
    }
  }

  link(name, ...args) {
    if (this.handlers === null) this.setup();
    try {
      return this.handlers[name](...args);
    } catch (e) {
      if (e instanceof TypeError) {
        throw new TypeError(`"${name}" is not a valid link handler.`);
      } else {
        throw e;
      }
    }
  }

  routeFromName(name) {
    if (this.routes === null) this.setup();
    return this.routes[name];
  }

  nameFromType(prefix, suffix, entity) {
    const adjustedType = `${entity.type
      .charAt(0)
      .toUpperCase()}${entity.type.slice(1, -1)}`;
    return `${prefix}${adjustedType}${suffix}`;
  }
}

export default new LinkHandler();
