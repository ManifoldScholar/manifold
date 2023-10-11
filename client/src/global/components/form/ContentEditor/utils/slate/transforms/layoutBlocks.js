import { Transforms, Node } from "slate";
import { ReactEditor } from "slate-react";
import { rteElements } from "../../elements";
import has from "lodash/has";

export const wrapLayoutBlock = ({
  editor,
  format,
  node: initialNode,
  path: initialPath,
  split
}) => {
  if (split)
    return Transforms.wrapNodes(editor, { type: format }, { split: true });

  const node =
    initialNode && has(initialNode, "text")
      ? Node.parent(editor, initialPath)
      : initialNode;
  const path = ReactEditor.findPath(editor, node);

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
