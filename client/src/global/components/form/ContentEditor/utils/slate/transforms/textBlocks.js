import { Transforms, Editor, Element, Node } from "slate";
import { ReactEditor } from "slate-react";
import isEqual from "lodash/isEqual";

const LIST_TYPES = ["ol", "ul"];

const handleLiTextChild = ({ editor, node, path, format }) => {
  const { anchor, focus } = editor.selection;
  const start = node.text.substring(0, anchor.offset);
  const target = node.text.substring(anchor.offset, focus.offset);
  const end = node.text.substring(focus.offset);

  const children = [
    { type: "list-sibling", slateOnly: true, children: [{ text: start }] },
    { type: format, children: [{ text: target }] },
    { type: "list-sibling", slateOnly: true, children: [{ text: end }] }
  ];

  Transforms.insertNodes(editor, children, { at: path });
};

export const toggleTextBlock = ({
  editor,
  format,
  node,
  path,
  split = false
}) => {
  if (node.text && Node.parent(editor, path).type === "li")
    return handleLiTextChild({ editor, node, path, format });

  if (node.type === "pre") Editor.removeMark(editor, "code", true);

  const type = LIST_TYPES.includes(format) ? "li" : format;

  Transforms.unwrapNodes(editor, {
    match: (n, p) =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      isEqual(p, path),
    split: true
  });

  if (node.slateOnly || format !== node.type) {
    const htmlAttrs = node.htmlAttrs?.class
      ? { class: node.htmlAttrs?.class }
      : undefined;
    return Editor.withoutNormalizing(editor, () => {
      Transforms.setNodes(
        editor,
        {
          type,
          slateOnly: undefined,
          htmlAttrs
        },
        { split }
      );
      if (type === "li") {
        Transforms.wrapNodes(editor, { type: format, children: [] });
      }
      if (format === "pre") Editor.addMark(editor, "code", true);
      ReactEditor.focus(editor);
    });
  }

  Transforms.setNodes(editor, { type: "p", slateOnly: undefined }, { split });
  ReactEditor.focus(editor);
};
