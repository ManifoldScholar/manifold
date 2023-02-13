import { slateToDomConfig as config } from "./slate-serializers";
import { slateToHtml } from "./slate-serializers/serializers/slateToHtml";
import { Element } from "domhandler";

const blankLineHandler = ({ node, children }) => {
  if (node.children[0].text === "") {
    return new Element("br");
  }
  return new Element("p", {}, children);
};

const testConfig = {
  ...config,
  elementTransforms: { ...config.elementTransforms, p: blankLineHandler }
};

const serializeToHtml = node => {
  return "<!DOCTYPE html>".concat(slateToHtml(node, testConfig));
};

export default serializeToHtml;
