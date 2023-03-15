import { wrapLink } from "../controls/LinkButton";
import { inlineNodes } from "../rteElements";
import { insertImage } from "../controls/ImageButton";
import { isValidUrl, isImageUrl } from "../slateHelpers";
import { mathMLElements } from "reader/containers/annotation/annotatable-components/mathHelpers";

/* eslint-disable no-param-reassign */
const withInlines = editor => {
  const { insertText, isInline } = editor;

  editor.isInline = element => {
    const isInlineMath =
      (element.type === "math" && element.htmlAttrs?.display === "inline") ||
      (element.type !== "math" && mathMLElements.includes(element.type));

    return (
      isInlineMath || inlineNodes.includes(element.type) || isInline(element)
    );
  };

  editor.insertText = text => {
    if (isImageUrl(text)) {
      return insertImage(editor, text);
    }
    if (isValidUrl(text)) {
      return wrapLink(editor, text);
    }
    insertText(text);
  };

  return editor;
};

export default withInlines;
