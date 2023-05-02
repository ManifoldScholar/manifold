import { getCommonBlock } from "./utils";
import { Node, Range } from "slate";
import { isValidUrl } from "../utils/helpers";
import {
  wrapLink,
  unwrapLink,
  isLinkActive
} from "../components/controls/buttons/LinkButton";

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
  if (button) button[0].click();
};
