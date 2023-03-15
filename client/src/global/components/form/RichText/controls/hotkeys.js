import { toggleMark } from "./MarkButton";
import { toggleBlock } from "./BlockButton";
import { Editor as SlateEditor, Transforms, Path } from "slate";
import { rteElements } from "../rteElements";

const handleInsertNode = editor => {
  // Grab the element node that contains the text where the user hit enter; Slate's default handling of enter would simply duplicate this node
  const prev = SlateEditor.above(editor, editor.selection);
  // Remove all attributes other than the type/tag, so we don't copy id, classes, etc.
  const { children, htmlAttrs, slateOnly, ...next } = prev[0];

  // Insert a paragraph if this node type isn't editable in the RTE
  if (!rteElements.includes(next.type)) next.type = "p";

  // Insert the adjusted node
  const path = Path.next(prev[1]);
  Transforms.insertNodes(
    editor,
    { ...next, children: [] },
    { at: editor.selection }
  );
  Transforms.select(editor, {
    anchor: { path: [...path, 0], offset: 0 },
    focus: { path: [...path, 0], offset: 0 }
  });
};

export const captureHotKeys = (e, editor) => {
  if (e.key === "Enter") {
    e.preventDefault();
    return handleInsertNode(editor);
  }
  if (!e.ctrlKey && !e.metaKey) return;

  /* eslint-disable default-case */
  // Prevent default only if we match a case so we don't block undo, paste, etc.
  if (e.altKey) {
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
