import React, { forwardRef, useRef } from "react";
import { Transforms } from "slate";
import { useSlate, ReactEditor } from "slate-react";
import Utility from "global/components/utility";
import Dialog from "global/components/dialog";
import { useConfirmation } from "hooks";
import InsertImageForm from "./insert/ImageForm";
import { isBlockActive } from "./BlockButton";
import * as Styled from "./styles";

export const insertImage = (editor, url, alt) => {
  const text = { text: "" };
  const image = { type: "img", htmlAttrs: { src: url, alt }, children: [text] };
  Transforms.insertNodes(editor, image);
};

const ImageButton = ({ icon, size, selection, ...rest }, ref) => {
  const editor = useSlate();
  const { confirm, confirmation } = useConfirmation();
  const urlRef = useRef(null);
  const altRef = useRef(null);

  const addImage = () => {
    ReactEditor.focus(editor);
    const url = urlRef?.current?.inputElement?.value;
    if (!url) return;
    const alt = altRef?.current?.inputElement?.value;
    Transforms.select(editor, selection);
    return insertImage(editor, url, alt);
  };

  const getImageData = e => {
    e.preventDefault();
    const heading = "Insert Image";
    const message = <InsertImageForm urlRef={urlRef} altRef={altRef} />;
    if (confirm)
      confirm(heading, message, addImage, {
        rejectLabel: "Cancel",
        resolveLabel: "Add"
      });
  };

  return (
    <>
      <Styled.Button
        ref={ref}
        {...rest}
        aria-label="image"
        data-active={isBlockActive(editor, "img")}
        onClick={getImageData}
        tabIndex={-1}
      >
        {icon && <Utility.IconComposer icon={icon} size={size} />}
      </Styled.Button>
      {confirmation && <Dialog.Confirm {...confirmation} />}
    </>
  );
};

export default forwardRef(ImageButton);
