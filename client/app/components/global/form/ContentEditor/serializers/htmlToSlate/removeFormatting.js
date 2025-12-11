import { Parser } from "htmlparser2";
import { DomHandler, Document } from "domhandler";
import { removeFormatOnlyChildren } from "./utils";
import htmlSerializer from "dom-serializer";

export const removeFormatting = html => {
  let update;
  const handler = new DomHandler((error, dom) => {
    if (error) {
      // TODO:  Handle error
    } else {
      const nodes = removeFormatOnlyChildren({ children: dom });
      update = htmlSerializer(new Document(nodes));
    }
  });

  const parser = new Parser(handler);
  parser.write(html);
  parser.end();

  return update;
};
