import { Transforms, Editor, Range } from "slate";
import { ReactEditor } from "slate-react";
import isEqual from "lodash/isEqual";
import { nestableElements } from "../../elements";
import { isMarkActive, getCommonBlock } from "../getters";
import { toggleTextBlock } from "./textBlocks";
import { insertOrWrapSpan, unwrapSpan } from "./spans";
import { wrapLayoutBlock } from "./layoutBlocks";

export const unwrapNode = ({ editor, format, path }) => {
  if (format === "span") return unwrapSpan({ editor, path });

  Transforms.liftNodes(editor, {
    match: (n, p) => {
      return n.type === format && isEqual(p, path);
    },
    at: path
  });
  ReactEditor.focus(editor);
};

export const toggleOrWrapNode = (editor, format) => {
  const isCollapsed = Range.isCollapsed(editor.selection);

  if (format === "span") {
    return insertOrWrapSpan(editor, isCollapsed);
  }

  const formatIsContainer = nestableElements.includes(format);
  const formatIsText = !formatIsContainer;

  const condition = formatIsContainer
    ? n => !Editor.isEditor(n) && !n.nodeName && !n.text
    : n => !Editor.isEditor(n) && !n.nodeName;

  const [common, path] = getCommonBlock(editor, condition);

  if (formatIsText)
    return toggleTextBlock({
      editor,
      format,
      node: common,
      path,
      split: !isCollapsed
    });

  return wrapLayoutBlock({
    editor,
    format,
    node: common,
    path,
    split: !isCollapsed
  });
};

export const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }

  ReactEditor.focus(editor);
};
