import { Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { rteElements } from "../../elements";

export const wrapLayoutBlock = ({ editor, format, node, path, split }) => {
  if (split)
    return Transforms.wrapNodes(editor, { type: format }, { split: true });

  Transforms.removeNodes(editor);

  if (!rteElements.includes(node.type)) {
    Transforms.insertNodes(
      editor,
      {
        ...node,
        children: [{ type: format, children: node.children }]
      },
      { at: path, select: true }
    );
  } else {
    Transforms.insertNodes(
      editor,
      {
        type: format,
        children: [node]
      },
      { at: path, select: true }
    );
  }
  ReactEditor.focus(editor);
};
