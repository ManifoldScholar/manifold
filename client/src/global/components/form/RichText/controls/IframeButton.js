import React from "react";
import { Transforms } from "slate";
import { useSlate, ReactEditor } from "slate-react";
import Utility from "global/components/utility";
import { isValidUrl } from "../slateHelpers";
import * as Styled from "./styles";

export const insertIframe = (editor, url) => {
  const text = { text: "" };
  const embed = { type: "iframe", htmlAttrs: { src: url }, children: [text] };
  Transforms.insertNodes(editor, embed);
  ReactEditor.focus(editor);
};

const IframeButton = ({ icon, size, selection }) => {
  const editor = useSlate();
  const onClick = () => {
    event.preventDefault();
    Transforms.select(editor, selection);
    const url = window.prompt("Enter the URL of the embed:");
    if (!isValidUrl(url)) return ReactEditor.focus(editor);
    return insertIframe(editor, url);
  };
  return (
    <Styled.Button aria-label="iframe" onClick={onClick}>
      {icon && <Utility.IconComposer icon={icon} size={size} />}
    </Styled.Button>
  );
};

export default IframeButton;
