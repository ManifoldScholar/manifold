import React from "react";
import { Editor, Element as SlateElement, Transforms, Range } from "slate";
import { useSlate } from "slate-react";
import Utility from "global/components/utility";
import * as Styled from "./styles";

export const isLinkActive = editor => {
  const [link] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "a"
  });
  return !!link;
};

const unwrapLink = editor => {
  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "a"
  });
};

export const wrapLink = (editor, url) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link = {
    type: "a",
    htmlAttrs: { href: url },
    children: isCollapsed ? [{ text: url }] : []
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }
};

const insertLink = (editor, url) => {
  if (editor.selection) {
    wrapLink(editor, url);
  }
};

const LinkButton = ({ icon, size }) => {
  const editor = useSlate();
  const active = isLinkActive(editor);
  const onMouseDown = () => {
    event.preventDefault();
    if (active) return unwrapLink(editor);
    const url = window.prompt("Enter the URL of the link:");
    if (!url) return;
    return insertLink(editor, url);
  };
  return (
    <Styled.Button active={active} onMouseDown={onMouseDown}>
      {icon && <Utility.IconComposer icon={icon} size={size} />}
    </Styled.Button>
  );
};

export default LinkButton;
