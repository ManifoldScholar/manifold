import { inlineNodes } from "../utils/elements";
import { wrapLink, insertImage, insertIframe } from "../utils/slate/transforms";
import { isValidUrl, isImageUrl, isVideoUrl } from "../utils/helpers";
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
    const isImage = isImageUrl(text);
    const isVideo = isVideoUrl(text);
    const isLink = isValidUrl(text);

    if (isImage) {
      return insertImage(editor, text);
    }
    if (isVideo) {
      return insertIframe(editor, text);
    }
    if (isLink) {
      return wrapLink(editor, text);
    }
    insertText(text);
  };

  return editor;
};

export default withInlines;
