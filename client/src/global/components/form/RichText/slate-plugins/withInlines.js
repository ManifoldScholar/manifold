import { wrapLink } from "../controls/LinkButton";
import { inlineNodes } from "../rteElements";
import { insertImage } from "../controls/ImageButton";
import { insertIframe } from "../controls/IframeButton";
import { isValidUrl, isImageUrl, isVideoUrl } from "../slateHelpers";
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

  // TODO: update delete to remove blank inlines

  return editor;
};

export default withInlines;
