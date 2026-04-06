import { v1 as uuidv1 } from "uuid";

class PluginRegistry {
  constructor() {
    this._registry = {};
  }

  add(component) {
    const id = uuidv1();
    this._registry[id] = component;
    return id;
  }

  get(id) {
    return this._registry[id];
  }
}

const instance = new PluginRegistry();
Object.freeze(instance);
export default instance;
