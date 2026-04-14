import { slateToHtml } from "./serializer";

const serializeToHtml = node => {
  return "<!DOCTYPE html>".concat(slateToHtml(node));
};

export default serializeToHtml;
