import React from "react";
import { Transforms } from "slate";
import { useSlate } from "slate-react";
import Utility from "global/components/utility";
import { isImageUrl } from "../slateHelpers";
import * as Styled from "./styles";

export const insertImage = (editor, url) => {
  const text = { text: "" };
  const image = { type: "img", htmlAttrs: { src: url }, children: [text] };
  Transforms.insertNodes(editor, image);
};

const ImageButton = ({ icon, size }) => {
  const editor = useSlate();
  const onMouseDown = () => {
    event.preventDefault();
    const url = window.prompt("Enter the URL of the image:");
    if (!isImageUrl(url)) return;
    return insertImage(editor, url);
  };
  return (
    <Styled.Button onMouseDown={onMouseDown}>
      {icon && <Utility.IconComposer icon={icon} size={size} />}
    </Styled.Button>
  );
};

export default ImageButton;
