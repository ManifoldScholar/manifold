import { Transforms, Editor, Path, Node } from "slate";
import { ReactEditor } from "slate-react";
import isEqual from "lodash/isEqual";
import has from "lodash/has";
import { isEmptyAndChildless } from "../getters";

export const insertOrWrapSpan = (editor, isCollapsed) => {
  if (isCollapsed) {
    Transforms.insertNodes(
      editor,
      { type: "span", children: [{ text: "" }] },
      { at: editor.selection.anchor, select: true }
    );
  } else {
    Transforms.wrapNodes(
      editor,
      { type: "span", children: [] },
      { split: true }
    );
  }
  ReactEditor.focus(editor);
};

export const unwrapSpan = ({ editor, path }) => {
  const parentPath = Path.parent(path);
  const [newParent] = Editor.node(editor, { at: parentPath });
  if (Editor.hasBlocks(editor, newParent)) {
    return Editor.withoutNormalizing(editor, () => {
      Transforms.wrapNodes(
        editor,
        { type: "div", slateOnly: true },
        {
          at: path,
          match: (n, p) => {
            return n.type === "span" && isEqual(p, path);
          }
        }
      );
      Transforms.removeNodes(editor, {
        match: (n, p) => {
          return has(n, "text") && !n.text && isEqual(p, Path.next(path));
        },
        at: parentPath
      });
      Transforms.liftNodes(editor, {
        match: (n, p) => {
          return n.type === "div" && isEqual(p, path);
        },
        at: path
      });
      const parent = Node.get(editor, parentPath);
      if (isEmptyAndChildless(editor, parent)) {
        Transforms.removeNodes(editor, {
          at: Path.parent(parentPath),
          match: n => {
            return isEqual(n, parent);
          }
        });
      }
      ReactEditor.focus(editor);
    });
  }
};
