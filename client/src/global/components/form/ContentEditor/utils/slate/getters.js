import { Editor, Node, Element } from "slate";
import { ReactEditor } from "slate-react";
import has from "lodash/has";
import { formatNodeLabel } from "./general";

export const getListItemNode = (editor, path) =>
  Editor.above(editor, {
    at: path,
    match: n => n.type === "li"
  }) ?? [];

export const getListNode = (editor, path) =>
  Editor.above(editor, {
    at: path,
    match: n => n.type === "ul" || n.type === "ol"
  }) ?? [];

// Use Node.string() rather than this when appropriate
export const getTextContent = (editor, iterator, str = "") => {
  const { value } = iterator.next();
  if (!value) return str;
  const [node] = value;
  const nextStr = node.text ? str + node.text : str;
  return getTextContent(editor, iterator, nextStr);
};

export const getCommonBlock = (editor, condition = () => true) => {
  const range = Editor.unhangRange(editor, editor.selection, { voids: true });

  const [common, path] = Node.common(
    editor,
    range.anchor.path,
    range.focus.path
  );

  if (
    (Editor.isBlock(editor, common) || Editor.isEditor(common)) &&
    condition(common)
  ) {
    return [common, path];
  } else {
    return Editor.above(editor, {
      at: path,
      match: n =>
        (Editor.isBlock(editor, n) || Editor.isEditor(n)) && condition(n)
    });
  }
};

export const getAncestors = (editor, iterator, list = {}) => {
  const { value } = iterator.next();
  if (!value) return list;
  const [node, path] = value;
  const key = ReactEditor.findKey(editor, node);
  const next =
    node.type && !node.slateOnly
      ? { ...list, [key.id]: { label: formatNodeLabel(node), path } }
      : list;
  return getAncestors(editor, iterator, next);
};

export const getNearestOfType = (editor, types) => {
  const [nearest, path] = Editor.above(editor, {
    at: Editor.unhangRange(editor, editor.selection),
    match: n =>
      !Editor.isEditor(n) &&
      types.includes(n.type) &&
      !n.nodeName &&
      !n.slateOnly
  });
  return { nearest, path };
};

export const isElementActive = (editor, format) => {
  const { selection } = editor;
  if (!selection) return [false];

  const nearest = Editor.above(editor, {
    at: Editor.unhangRange(editor, selection),
    match: n =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      !n.nodeName &&
      !n.slateOnly &&
      n.type === format
  });

  const [node, path] = nearest ?? [];

  // Include path in return so we can determine highest or lowest for display.
  return nearest ? [node.type === format, path] : [false];
};

export const isTextBlockActive = (editor, format) => {
  const { selection } = editor;
  if (!selection) return [false];

  const block = Editor.above(editor, {
    at: Editor.unhangRange(editor, selection),
    match: n =>
      !Editor.isEditor(n) &&
      Editor.isBlock(editor, n) &&
      !n.nodeName &&
      !n.slateOnly &&
      n.type === format
  });

  const [node, path] = block ?? [];

  // Include path in return so we can determine highest or lowest for display.
  return block ? [node?.type === format, path] : [false];
};

export const isMarkActive = (editor, format) => {
  if (!editor.selection) return false;
  const node = Node.get(editor, editor.selection.focus.path);
  const marks = node.text ? Editor.marks(editor) : false;

  if (format === "code") {
    const [pre] = Editor.above(editor, { match: n => n.type === "pre" }) ?? [];
    if (pre) return false;
  }
  return marks ? marks[format] === true : false;
};

export const isLinkActive = editor => {
  const [link] = Editor.nodes(editor, {
    match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === "a"
  });
  return !!link;
};

export const isEmptyAndChildless = (editor, node) => {
  const onlyChildIsEmptyText =
    node.children.length === 1 && has(node.children[0], "text");
  return (
    Editor.isEmpty(editor, node) &&
    (onlyChildIsEmptyText || !node.children.length)
  );
};
