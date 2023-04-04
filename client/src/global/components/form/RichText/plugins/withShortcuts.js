import {
  Editor,
  Element as SlateElement,
  Point,
  Range,
  Transforms
} from "slate";
import { toggleBlock } from "../components/controls/BlockButton";

const SHORTCUTS = {
  "*": "ul",
  "-": "ul",
  "1.": "ol",
  ">": "blockquote",
  "#": "h1",
  "##": "h2",
  "###": "h3"
};

/* eslint-disable no-param-reassign */
const withShortcuts = editor => {
  const { deleteBackward, insertText } = editor;

  editor.insertText = text => {
    const { selection } = editor;

    if (text.endsWith(" ") && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection;
      const block = Editor.above(editor, {
        match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n)
      });
      const path = block ? block[1] : [];
      const start = Editor.start(editor, path);
      const range = { anchor, focus: start };
      const beforeText = Editor.string(editor, range) + text.slice(0, -1);
      const type = SHORTCUTS[beforeText];

      if (type) {
        Transforms.select(editor, range);

        if (!Range.isCollapsed(range)) {
          Transforms.delete(editor);
        }

        return toggleBlock(editor, type);
      }
    }

    insertText(text);
  };

  editor.deleteBackward = (...args) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const match = Editor.above(editor, {
        match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n)
      });

      if (match) {
        const [block, path] = match;
        const start = Editor.start(editor, path);

        if (
          !Editor.isEditor(block) &&
          SlateElement.isElement(block) &&
          block.type !== "p" &&
          Point.equals(selection.anchor, start)
        ) {
          const newProperties = {
            type: "p"
          };
          Transforms.setNodes(editor, newProperties);

          if (block.type === "li") {
            Transforms.unwrapNodes(editor, {
              match: n =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                (n.type === "ul" || n.type === "ol"),
              split: true
            });
          }

          return;
        }
      }

      deleteBackward(...args);
    }
  };

  return editor;
};

export default withShortcuts;
