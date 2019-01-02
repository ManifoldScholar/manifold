import blocks from "../Block/types";
import forms from "../TypeForm/types";

class Resolver {
  typeToComponentKey(type) {
    const matches = type.match(/^Content::(.*)Block$/);
    if (!matches) return null;
    return matches[1];
  }

  typeToComponent(type, types) {
    const key = this.typeToComponentKey(type);
    if (!key) return null;
    const component = types[key];
    return component || null;
  }

  typeToBlockComponent(type) {
    return this.typeToComponent(type, blocks);
  }

  typeToFormComponent(type) {
    return this.typeToComponent(type, forms);
  }

  typeToAvailableId(type) {
    return type;
  }

  typeToCurrentId(id) {
    return `current-${id}`;
  }
}

export default new Resolver();
