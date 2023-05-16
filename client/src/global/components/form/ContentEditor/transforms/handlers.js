import { getCommonBlock } from "./utils";
import { isValidUrl } from "../utils/helpers";
import {
  wrapLink,
  unwrapLink,
  isLinkActive
} from "../components/controls/buttons/LinkButton";
import { Editor as SlateEditor, Transforms, Path, Range, Node } from "slate";
import { rteElements, inlineNodes } from "../utils/elements";
import { setSelectionAtPoint } from "./utils";
import { decreaseIndent } from "./indents";

export const handleLinkHotkey = editor => {
  if (isLinkActive(editor)) return unwrapLink(editor);

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);

  // If the selection is a range of text, check to see if that range is a url; if so, turn it into a link.
  if (!isCollapsed) {
    const [block] = getCommonBlock(editor);
    const textContent = Node.string(block);
    if (isValidUrl(textContent)) return wrapLink(editor, textContent);
  }

  // Otherwise, open the link insert modal
  const button = document.getElementsByName("link-modal-trigger");
  if (button[0]) button[0].click();
};

export const handleImageHotkey = () => {
  const button = document.getElementsByName("img-modal-trigger");
  if (button[0]) button[0].click();
};

export const handleIframeHotkey = () => {
  const button = document.getElementsByName("iframe-modal-trigger");
  if (button[0]) button[0].click();
};

export const handleInsertNode = editor => {
  const { selection } = editor;
  // Grab the element node that contains the text where the user hit enter; Slate's default handling of enter would simply duplicate this node
  const [node, path] = SlateEditor.above(editor, selection);
  // Remove all attributes other than the type/tag, so we don't copy id, classes, etc.
  const { children, htmlAttrs, slateOnly, ...next } = node;

  // Set the path for the new node based on whether the element node is block or inline; the new node will be block so it must not be a sibling of an inline
  const nextPath = inlineNodes.includes(next.type)
    ? Path.next(Path.parent(path))
    : Path.next(path);

  // Insert a paragraph if this node type isn't editable in the RTE; handle unwrapping the list item if we're on an empty li
  if (!rteElements.includes(next.type)) next.type = "p";
  if (next.type === "a" || next.type === "img" || next.type === "iframe")
    next.type = "p";
  if (next.type === "li") {
    const isCollapsed = selection && Range.isCollapsed(selection);
    const liIsEmpty = SlateEditor.isEmpty(editor, node);
    if (isCollapsed && liIsEmpty) return decreaseIndent(editor, true);
  }

  // Insert the adjusted node
  Transforms.insertNodes(
    editor,
    { ...next, children: [{ text: "" }] },
    { at: selection }
  );
  // Set the cursor position at the first child of the new node
  setSelectionAtPoint(editor, [...nextPath, 0]);
};

export const insertSoftBreak = editor => {
  Transforms.insertText(editor, "\n");
};
