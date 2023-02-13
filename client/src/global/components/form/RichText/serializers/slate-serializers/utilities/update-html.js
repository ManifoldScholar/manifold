import { getChildren } from "domutils";
import { Element } from "domhandler";

export const renameTag = (tagName, replacementTagName) => ({
  [tagName]: element => {
    return new Element(
      replacementTagName,
      element.attribs,
      getChildren(element)
    );
  }
});
