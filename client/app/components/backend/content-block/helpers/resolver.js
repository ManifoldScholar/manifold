import blocks from "../Builder/Block/types";
import forms from "../TypeForm/types";
import contentBlockHelpers from "helpers/contentBlockHelpers";
import transform from "lodash/transform";

class Resolver {
  blockComponentsByType() {
    /* eslint-disable no-param-reassign */
    return transform(blocks, (result, val, key) => {
      result[contentBlockHelpers.componentKeyToType(key)] = val;
    });
    /* eslint-enable no-param-reassign */
  }

  typeToBlockComponent(type) {
    return contentBlockHelpers.typeToComponent(type, blocks);
  }

  typeToFormComponent(type) {
    return contentBlockHelpers.typeToComponent(type, forms);
  }
}

export default new Resolver();
