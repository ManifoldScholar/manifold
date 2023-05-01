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
  if (!isCollapsed) {
    const [block] = getCommonBlock(editor);
    const textContent = Node.string(block);
    if (isValidUrl(textContent)) return wrapLink(editor, textContent);
  }

  const button = document.getElementsByName("link-modal-trigger");
  if (button) button[0].click();
};
