import React, { forwardRef } from "react";
import { Editor, Element as SlateElement, Transforms, Range } from "slate";
import { useSlate, ReactEditor } from "slate-react";
import Utility from "global/components/utility";
import { isValidUrl } from "../../utils/helpers";
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
  ReactEditor.focus(editor);
};

export const wrapLink = (editor, url) => {
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

  ReactEditor.focus(editor);
};

const insertLink = (editor, url) => {
  if (editor.selection) {
    wrapLink(editor, url);
  }
  ReactEditor.focus(editor);
};

const LinkButton = ({ icon, size, selection, ...rest }, ref) => {
  const editor = useSlate();
  const active = isLinkActive(editor);
  const onClick = () => {
    event.preventDefault();
    Transforms.select(editor, selection);
    if (active) return unwrapLink(editor);
    const url = window.prompt("Enter the URL of the link:");
    if (!isValidUrl(url)) return ReactEditor.focus(editor);
    return insertLink(editor, url);
  };
  return (
    <Styled.Button
      ref={ref}
      {...rest}
      aria-label="link"
      active={active}
      onClick={onClick}
      tabIndex={-1}
    >
      {icon && <Utility.IconComposer icon={icon} size={size} />}
    </Styled.Button>
  );
};

export default forwardRef(LinkButton);
