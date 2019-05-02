import contentBlockHelpers from "helpers/contentBlockHelpers";
import blocks from "../Block/types";

class Resolver {
  typeToBlockComponent(type) {
    return contentBlockHelpers.typeToComponent(type, blocks);
  }
}

export default new Resolver();
