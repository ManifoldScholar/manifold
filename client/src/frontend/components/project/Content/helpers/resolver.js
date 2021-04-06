import blocks from "../types";
import contentBlockHelpers from "helpers/contentBlockHelpers";

class Resolver {
  typeToBlockComponent(type) {
    return contentBlockHelpers.typeToComponent(type, blocks);
  }
}

export default new Resolver();
