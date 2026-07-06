class PluginRegistry {
  constructor() {
    this._registry = {};
  }

  add(component) {
    const id = crypto.randomUUID();
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
