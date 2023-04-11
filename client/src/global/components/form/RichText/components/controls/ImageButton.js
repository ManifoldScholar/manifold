import React, { forwardRef } from "react";
import { Transforms } from "slate";
import { useSlate, ReactEditor } from "slate-react";
import Utility from "global/components/utility";
import { isImageUrl } from "../../utils/helpers";
import * as Styled from "./styles";

// Maybe do something fancier here to prevent images from ending up alone in pargraphs?
export const insertImage = (editor, url) => {
  const text = { text: "" };
  const image = { type: "img", htmlAttrs: { src: url }, children: [text] };
  Transforms.insertNodes(editor, image);
  ReactEditor.focus(editor);
};

const ImageButton = ({ icon, size, selection, ...rest }, ref) => {
  const editor = useSlate();
  const onClick = () => {
    event.preventDefault();
    Transforms.select(editor, selection);
    const url = window.prompt("Enter the URL of the image:");
    if (!isImageUrl(url)) return ReactEditor.focus(editor);
    return insertImage(editor, url);
  };
  return (
    <Styled.Button
      ref={ref}
      {...rest}
      aria-label="image"
      onClick={onClick}
      tabIndex={-1}
    >
      {icon && <Utility.IconComposer icon={icon} size={size} />}
    </Styled.Button>
  );
};

export default forwardRef(ImageButton);