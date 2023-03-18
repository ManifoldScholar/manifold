import { toggleMark } from "./MarkButton";
import { toggleBlock } from "./BlockButton";
import { Editor as SlateEditor, Transforms, Path } from "slate";
import { rteElements, inlineNodes } from "../rteElements";
import { increaseIndent, decreaseIndent } from "./transforms/indents";
import { setSelectionAtPoint, getListItemNode } from "./transforms/utils";

const handleInsertNode = editor => {
  // Grab the element node that contains the text where the user hit enter; Slate's default handling of enter would simply duplicate this node
  const [node, path] = SlateEditor.above(editor, editor.selection);
  // Remove all attributes other than the type/tag, so we don't copy id, classes, etc.
  const { children, htmlAttrs, slateOnly, ...next } = node;

  // Set the path for the new node based on whether the element node is block or inline; the new node will be block so it must not be a sibling of an inline
  const nextPath = inlineNodes.includes(next.type)
    ? Path.next(Path.parent(path))
    : Path.next(path);

  // Insert a paragraph if this node type isn't editable in the RTE; insert a list item if the node is the child of a list item
  if (!rteElements.includes(next.type)) next.type = "p";
  if (next.type === "a") next.type = "p";
  if (SlateEditor.node(editor, Path.parent(path)) === "li") next.type = "li";

  // Insert the adjusted node
  Transforms.insertNodes(
    editor,
    { ...next, children: [{ text: "" }] },
    { at: editor.selection }
  );
  // Set the cursor position at the first child of the new node
  setSelectionAtPoint(editor, [...nextPath, 0]);
};

const insertSoftBreak = editor => {
  Transforms.insertText(editor, "\n");
};

export const captureHotKeys = (e, editor) => {
  if (e.key === "Enter") {
    e.preventDefault();
    if (e.shiftKey) {
      return insertSoftBreak(editor);
    }
    return handleInsertNode(editor);
  }

  if (e.key === "Tab") {
    // Check that the selection is a list item before preventing default
    const [node] = getListItemNode(editor, editor.selection);
    if (!node) return;

    e.preventDefault();

    if (e.shiftKey) {
      return decreaseIndent(editor);
    }
    return increaseIndent(editor);
  }

  if (!e.metaKey && !e.ctrlKey) return;

  /* eslint-disable default-case */
  // Prevent default only if we match a case so we don't block undo, paste, etc.
  if ((e.metaKey && e.altKey) || (e.ctrlKey && e.shiftKey)) {
    switch (e.keyCode) {
      case 49:
        e.preventDefault();
        return toggleBlock(editor, "h1");
      case 50:
        e.preventDefault();
        return toggleBlock(editor, "h2");
      case 51:
        e.preventDefault();
        return toggleBlock(editor, "h3");
      case 52:
        e.preventDefault();
        return toggleBlock(editor, "ol");
      case 53:
        e.preventDefault();
        return toggleBlock(editor, "ul");
      case 54:
        e.preventDefault();
        return toggleBlock(editor, "blockquote");
    }
  }

  if (e.shiftKey && e.key === "s") {
    e.preventDefault();
    return toggleMark(editor, "strikethrough");
  }

  switch (e.key) {
    case "b":
      e.preventDefault();
      return toggleMark(editor, "bold");
    case "i":
      e.preventDefault();
      return toggleMark(editor, "italic");
    case "u":
      e.preventDefault();
      return toggleMark(editor, "underline");
    case "k":
      e.preventDefault();
      return toggleBlock(editor, "link");
  }
};
