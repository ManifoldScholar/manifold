import { Transforms, Editor, Range, Element } from "slate";
import { ReactEditor } from "slate-react";
import { rteElements, nestableElements } from "../elements";
import { isMarkActive } from "./getters";

const LIST_TYPES = ["ol", "ul"];

export const toggleTextBlock = ({ editor, format, node, split = false }) => {
  if (node.type === "pre") Editor.removeMark(editor, "code", true);

  const type = LIST_TYPES.includes(format) ? "li" : format;

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      LIST_TYPES.includes(n.type),
    split: true
  });

  if (node.slateOnly || format !== node.type) {
    return Editor.withoutNormalizing(editor, () => {
      Transforms.setNodes(
        editor,
        {
          type,
          slateOnly: undefined,
          htmlAttrs: { class: node.htmlAttrs?.class }
        },
        { split }
      );
      if (type === "li") {
        Transforms.wrapNodes(editor, { type: format, children: [] });
      }
      if (format === "pre") Editor.addMark(editor, "code", true);
    });
  }

  Transforms.setNodes(editor, { type: "p", slateOnly: undefined }, { split });
};

const wrapContainerBlock = ({ editor, format, node, path }) => {
  if (!rteElements.includes(node.type)) {
    Transforms.insertNodes(
      editor,
      {
        ...node,
        children: [{ type: format, children: node.children }]
      },
      { at: path }
    );
  } else {
    Transforms.insertNodes(
      editor,
      {
        type: format,
        children: [node]
      },
      { at: path }
    );
  }
  Transforms.removeNodes(editor);
};

export const unwrapContainerBlock = ({ editor, format }) => {
  Transforms.liftNodes(editor, {
    mode: "lowest",
    match: n => n.type === format
  });
};

export const toggleOrWrapBlock = (editor, format) => {
  const isCollapsed = Range.isCollapsed(editor.selection);

  const [nearest, path] = Editor.above(editor, {
    at: Editor.unhangRange(editor, editor.selection),
    match: n =>
      !Editor.isEditor(n) &&
      Editor.isBlock(editor, n) &&
      !n.nodeName &&
      n.type !== "li"
  });

  if (
    (nearest.slateOnly || rteElements.includes(nearest.type)) &&
    !nestableElements.includes(format)
  )
    return toggleTextBlock({
      editor,
      format,
      node: nearest,
      split: !isCollapsed
    });

  return wrapContainerBlock({ editor, format, node: nearest, path });
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
