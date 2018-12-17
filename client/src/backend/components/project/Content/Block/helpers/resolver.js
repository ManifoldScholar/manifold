import types from "../types";

class Resolver {
  typeToComponentKey(type) {
    const matches = type.match(/^Content::(.*)Block$/);
    if (!matches) return null;
    return matches[1];
  }

  typeToComponent(type) {
    const key = this.typeToComponentKey(type);
    if (!key) return null;
    const component = types[key];
    return component || null;
  }

  typeToAvailableId(type) {
    return type;
  }

  typeToCurrentId(id) {
    return `current-${id}`;
  }
}

export default new Resolver();
