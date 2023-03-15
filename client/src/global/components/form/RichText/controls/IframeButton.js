import React from "react";
import { Transforms } from "slate";
import { useSlate } from "slate-react";
import Utility from "global/components/utility";
import { isValidUrl } from "../slateHelpers";
import * as Styled from "./styles";

export const insertIframe = (editor, url) => {
  const text = { text: "" };
  const embed = { type: "iframe", htmlAttrs: { src: url }, children: [text] };
  Transforms.insertNodes(editor, embed);
};

const IframeButton = ({ icon, size }) => {
  const editor = useSlate();
  const onMouseDown = () => {
    event.preventDefault();
    const url = window.prompt("Enter the URL of the embed:");
    // if (!isValidUrl(url)) return;
    return insertIframe(editor, url);
  };
  return (
    <Styled.Button onMouseDown={onMouseDown}>
      {icon && <Utility.IconComposer icon={icon} size={size} />}
    </Styled.Button>
  );
};

export default IframeButton;
