import {
  Editor,
  Element as SlateElement,
  Point,
  Range,
  Transforms,
  Path,
  Node
} from "slate";
import { toggleBlock } from "../components/controls/buttons/BlockButton";
import { inlineNodes } from "../utils/elements";
import { getTextContent, getListItemNode } from "../transforms/utils";
import { decreaseIndent } from "../transforms/indents";

const SHORTCUTS = {
  "*": "ul",
  "-": "ul",
  "+": "ul",
  "1.": "ol",
  ">": "blockquote",
  "#": "h1",
  "##": "h2",
  "###": "h3",
  "####": "h4",
  "```": "pre"
};

const INLINE_SHORTCUTS = {
  "*": "italic",
  "**": "bold",
  "`": "code",
  "~": "strikethrough"
};

/* eslint-disable no-param-reassign */
const withShortcuts = editor => {
  const { deleteBackward, insertText } = editor;

  // Insert block elements from .md shortcuts
  editor.insertText = text => {
    const { selection } = editor;
    const { anchor } = selection;

    if (text.endsWith(" ") && selection && Range.isCollapsed(selection)) {
      const [block, path] =
        Editor.above(editor, {
          match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n)
        }) ?? [];
      const start = Editor.start(editor, path);
      const range = { anchor, focus: start };

      const blockType =
        SHORTCUTS[Editor.string(editor, range) + text.slice(0, -1)];

      if (blockType) {
        Transforms.select(editor, range);
        if (!Range.isCollapsed(range)) {
          Transforms.delete(editor);
        }
        return toggleBlock(editor, blockType);
      }
    }

    // Insert inline elements (Slate "marks") from .md
    let shortcut;
    const shortCutChars = ["*", "`", "~"];

    if (shortCutChars.includes(text)) {
      const [textNode, textNodePath] = Editor.first(editor, anchor.path);
      const beforeText = Node.string(textNode);

      if (text === "~") {
        shortcut = "~";
      }
      if (text === "`") {
        shortcut = "`";
      }
      if (text === "*") {
        if (beforeText.endsWith("*")) shortcut = "**";
        if (beforeText.indexOf("**") === -1) shortcut = "*";
      }

      if (shortcut) {
        const startIndex = beforeText.indexOf(shortcut);
        const endIndex =
          shortcut.length - 1 > 0 ? -(shortcut.length - 1) : undefined;
        const target = beforeText.slice(startIndex + shortcut.length, endIndex);

        if (startIndex >= 0 && target) {
          const anchor = { path: textNodePath, offset: startIndex };
          const focus = { path: textNodePath, offset: beforeText.length };

          return Editor.withoutNormalizing(editor, () => {
            Transforms.select(editor, { anchor, focus });
            Editor.addMark(editor, INLINE_SHORTCUTS[shortcut], true);
            Transforms.delete(editor, {
              at: anchor,
              distance: shortcut.length,
              unit: "character"
            });
            Transforms.collapse(editor, { edge: "end" });
            if (shortcut.length > 1) {
              Transforms.delete(editor, {
                distance: shortcut.length - 1,
                unit: "character",
                reverse: true
              });
            }
          });
        }
      }
    }

    return insertText(text);
  };

  const removeEmptyInlines = (editor, selection) => {
    const match = type => inlineNodes.includes(type);

    const [inline, inlinePath] =
      Editor.previous(editor, {
        match: n => match(n.type)
      }) ?? [];
    const inlineStart = Editor.start(editor, inlinePath);

    if (inline) {
      const textContent = getTextContent(editor, Node.texts(inline));

      if (
        Point.isBefore(inlineStart, selection.anchor) &&
        textContent.length === 1
      ) {
        Transforms.removeNodes(editor, {
          at: inlinePath,
          match: n => match(n.type)
        });
      }
    }
  };

  editor.deleteBackward = (...args) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [li, liPath] = getListItemNode(editor, editor.selection);
      if (li) {
        const liIsEmpty = Editor.isEmpty(editor, li);
        if (liIsEmpty) return decreaseIndent(editor, true);
      }

      removeEmptyInlines(editor, selection);

      const match =
        Editor.above(editor, {
          match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n)
        }) ?? [];

      if (match) {
        const [block, path] = match;
        const start = Editor.start(editor, path);

        if (
          !Editor.isEditor(block) &&
          SlateElement.isElement(block) &&
          block.type !== "p" &&
          Point.equals(selection.anchor, start)
        ) {
          Transforms.setNodes(editor, { type: "p" });

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
    }
    deleteBackward(...args);
  };

  return editor;
};

export default withShortcuts;
