import isFunction from "lodash/isFunction";
import isObject from "lodash/isObject";
import isArray from "lodash/isArray";
import forEach from "lodash/forEach";
import getRoutes from "/routes";

class LinkHandler {
  extract(route) {
    const { name, helpers, helper, routes } = route;
    if (name) {
      if (isFunction(helper)) this.handlers[name] = helper;
    }
    if (isObject(helpers)) {
      forEach(helpers, (value, key) => {
        this.handlers[key] = value;
      });
    }
    if (isArray(routes)) {
      routes.forEach(aRoute => {
        this.extract(aRoute);
      });
    }
  }

  setup() {
    this.handlers = {};
    getRoutes().forEach(route => {
      this.extract(route);
    });
  }

  constructor() {
    this.handlers = null;
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

  nameFromType(prefix, suffix, entity) {
    const adjustedType = `${entity.type
      .charAt(0)
      .toUpperCase()}${entity.type.slice(1, -1)}`;
    return `${prefix}${adjustedType}${suffix}`;
  }
}

export default new LinkHandler();
