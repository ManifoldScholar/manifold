import { toggleMark } from "../components/controls/buttons/MarkButton";
import { toggleBlock } from "../components/controls/buttons/BlockButton";
import { increaseIndent, decreaseIndent } from "./indents";
import { getListItemNode } from "./utils";
import {
  handleLinkHotkey,
  handleImageHotkey,
  handleIframeHotkey,
  handleInsertNode,
  insertSoftBreak
} from "./handlers";

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
      case 48:
        e.preventDefault();
        return toggleBlock(editor, "p");
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
        return toggleBlock(editor, "h4");
      case 53:
        e.preventDefault();
        return toggleBlock(editor, "ol");
      case 54:
        e.preventDefault();
        return toggleBlock(editor, "ul");
      case 55:
        e.preventDefault();
        return toggleBlock(editor, "blockquote");
      case 56:
        e.preventDefault();
        return toggleBlock(editor, "pre");
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
    case "e":
      e.preventDefault();
      return toggleMark(editor, "code");
    case "k":
      e.preventDefault();
      return handleLinkHotkey(editor);
    case "g":
      e.preventDefault();
      return handleImageHotkey(editor);
    case "f":
      e.preventDefault();
      return handleIframeHotkey(editor);
  }
};
