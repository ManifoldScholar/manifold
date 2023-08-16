import { Editor, Element, Range, Transforms, Node } from "slate";
import { toggleOrWrapNode } from "../utils/slate/transforms";

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
  "#####": "h5",
  "######": "h6",
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
  const { insertText } = editor;

  // Insert block elements from .md shortcuts
  editor.insertText = text => {
    const { selection } = editor;
    const { anchor } = selection;

    if (text.endsWith(" ") && selection && Range.isCollapsed(selection)) {
      /* eslint-disable no-unused-vars */
      const [block, path] =
        Editor.above(editor, {
          match: n => Element.isElement(n) && Editor.isBlock(editor, n)
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
        return toggleOrWrapNode(editor, blockType);
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

        if (shortcut === "`" && target === "`") return insertText(text);

        if (startIndex >= 0 && target) {
          const contentAnchor = { path: textNodePath, offset: startIndex };
          const contentFocus = {
            path: textNodePath,
            offset: beforeText.length
          };

          return Editor.withoutNormalizing(editor, () => {
            Transforms.select(editor, {
              anchor: contentAnchor,
              focus: contentFocus
            });
            Editor.addMark(editor, INLINE_SHORTCUTS[shortcut], true);
            Transforms.delete(editor, {
              at: contentAnchor,
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

  return editor;
};

export default withShortcuts;
