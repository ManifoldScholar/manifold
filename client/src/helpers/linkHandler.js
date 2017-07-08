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
    return this.handlers[name](...args);
  }
}

export default new LinkHandler();
