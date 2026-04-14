class ContentBlockHelpers {
  typeToComponentKey(type) {
    const matches = type.match(/^Content::(.*)Block$/);
    if (!matches) return null;
    return matches[1];
  }

  componentKeyToType(key) {
    return `Content::${key}Block`;
  }

  typeToComponent(type, types) {
    const key = this.typeToComponentKey(type);
    if (!key) return null;
    const component = types[key];
    return component || null;
  }
}

export default new ContentBlockHelpers();
