import { Transforms, Editor, Node, Range, Element } from "slate";
import { ReactEditor } from "slate-react";

export const clearSlate = editor => {
  const count = Array(editor.children.length).keys();
  [...count].forEach(() => {
    try {
      Transforms.removeNodes(editor, { at: [0] });
    } catch (e) {
      return e;
    }
  });
};

export const setSelectionAtPoint = (editor, path, offset = 0) => {
  Transforms.select(editor, {
    anchor: { path, offset },
    focus: { path, offset }
  });
};

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

export const getCommonBlock = editor => {
  const range = Editor.unhangRange(editor, editor.selection, { voids: true });

  const [common, path] = Node.common(
    editor,
    range.anchor.path,
    range.focus.path
  );

  if (Editor.isBlock(editor, common) || Editor.isEditor(common)) {
    return [common, path];
  } else {
    return Editor.above(editor, {
      at: path,
      match: n => Editor.isBlock(editor, n) || Editor.isEditor(n)
    });
  }
};

export const formatNodeLabel = node => {
  let label = node.type === "void" ? node.nodeName : node.type;
  const { htmlAttrs } = node ?? {};
  if (htmlAttrs?.id) label = `${label}#${htmlAttrs.id}`;
  if (htmlAttrs?.class) label = `${label}.${htmlAttrs.class.replace(" ", ".")}`;
  return label;
};

export const getAncestors = (editor, iterator, list = {}) => {
  const { value } = iterator.next();
  if (!value) return list;
  const [node] = value;
  const key = ReactEditor.findKey(editor, node);
  const next =
    node.type && !node.slateOnly
      ? { ...list, [key.id]: formatNodeLabel(node) }
      : list;
  return getAncestors(editor, iterator, next);
};

const LIST_TYPES = ["ol", "ul"];

export const isBlockActive = (editor, format) => {
  const { selection } = editor;
  if (!selection) return false;

  const matches = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) && n.type === format && !n.nodeName && !n.slateOnly
    })
  );

  return !!matches.length;
};

/* eslint-disable no-nested-ternary */
export const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  if (isActive && format === "pre") Editor.removeMark(editor, "code", true);

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      LIST_TYPES.includes(n.type),
    split: true
  });

  const newProperties = {
    type: isActive ? "p" : isList ? "li" : format
  };

  if (Range.isCollapsed(editor.selection)) {
    Transforms.setNodes(editor, newProperties);
  } else {
    Transforms.setNodes(editor, newProperties, editor.selection.anchor);
  }

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }

  if (!isActive && format === "pre") Editor.addMark(editor, "code", true);

  ReactEditor.focus(editor);
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

export const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }

  ReactEditor.focus(editor);
};

export const getNearestOfType = (editor, types) => {
  const [container, containerPath] = Editor.above(editor, {
    at: Editor.unhangRange(editor, editor.selection),
    match: n =>
      !Editor.isEditor(n) &&
      types.includes(n.type) &&
      !n.nodeName &&
      !n.slateOnly
  });
  return { container, containerPath };
};

export const insertIframe = (editor, url, title) => {
  const text = { text: "", slateOnly: true };
  const embed = {
    type: "iframe",
    htmlAttrs: { src: url, title },
    children: [text]
  };
  const [node] = Editor.above(editor, editor.selection);
  if (Editor.isEmpty(editor, node)) {
    Transforms.removeNodes(editor);
  }
  Transforms.insertNodes(editor, embed);
  ReactEditor.focus(editor);
};

export const insertImage = (editor, url, alt) => {
  const text = { text: "", slateOnly: true };
  const image = {
    type: "img",
    htmlAttrs: { src: url, alt: alt ?? "" },
    children: [text]
  };
  const [node] = Editor.above(editor, editor.selection);
  if (Editor.isEmpty(editor, node)) {
    Transforms.removeNodes(editor);
  }
  Transforms.insertNodes(editor, image);
  ReactEditor.focus(editor);
};

export const isLinkActive = editor => {
  const [link] = Editor.nodes(editor, {
    match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === "a"
  });
  return !!link;
};

export const unwrapLink = editor => {
  Transforms.unwrapNodes(editor, {
    match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === "a"
  });
  ReactEditor.focus(editor);
};

export const wrapLink = (editor, url, text) => {
  const { selection } = editor ?? {};
  if (!selection) return;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link = {
    type: "a",
    htmlAttrs: { href: url },
    children: isCollapsed ? [{ text: text ?? url }] : []
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }

  ReactEditor.focus(editor);
};
