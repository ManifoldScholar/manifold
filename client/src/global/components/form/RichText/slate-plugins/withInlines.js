import { wrapLink } from "../controls/LinkButton";
import { inlineNodes } from "../rteElements";
import { isValidUrl } from "../slateHelpers";
import { mathMLElements } from "reader/containers/annotation/annotatable-components/mathHelpers";

/* eslint-disable no-param-reassign */
const withInlines = editor => {
  const { insertData, insertText, isInline } = editor;

  editor.isInline = element => {
    const isInlineMath =
      (element.type === "math" && element.htmlAttrs?.display === "inline") ||
      (element.type !== "math" && mathMLElements.includes(element.type));

    return (
      isInlineMath || inlineNodes.includes(element.type) || isInline(element)
    );
  };

  editor.insertText = text => {
    if (text && isValidUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = data => {
    const text = data.getData("text/plain");

    if (text && isValidUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

export default withInlines;
