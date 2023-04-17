import React, { forwardRef, useRef } from "react";
import { Transforms } from "slate";
import { useSlate, ReactEditor } from "slate-react";
import Dialog from "global/components/dialog";
import InsertIframeForm from "./insert/IframeForm";
import { useConfirmation } from "hooks";
import Utility from "global/components/utility";
import { isValidUrl } from "../../../utils/helpers";
import { isBlockActive } from "./BlockButton";
import * as Styled from "./styles";

export const insertIframe = (editor, url, title) => {
  const text = { text: "" };
  const embed = {
    type: "iframe",
    htmlAttrs: { src: url, title },
    children: [text]
  };
  Transforms.insertNodes(editor, embed);
};

const IframeButton = ({ icon, size, selection, ...rest }, ref) => {
  const editor = useSlate();
  const { confirm, confirmation } = useConfirmation();
  const urlRef = useRef(null);
  const titleRef = useRef(null);

  const addIframe = () => {
    ReactEditor.focus(editor);
    const url = urlRef?.current?.inputElement?.value;
    if (!url) return;
    const title = titleRef?.current?.inputElement?.value;
    Transforms.select(editor, selection);
    if (!isValidUrl(url)) return;
    return insertIframe(editor, url, title);
  };

  const getIframeData = e => {
    e.preventDefault();
    const heading = "Insert Iframe";
    const message = <InsertIframeForm urlRef={urlRef} titleRef={titleRef} />;
    if (confirm)
      confirm(heading, message, addIframe, {
        rejectLabel: "Cancel",
        resolveLabel: "Add"
      });
  };

  return (
    <>
      <Styled.Button
        ref={ref}
        {...rest}
        aria-label="iframe"
        data-active={isBlockActive(editor, "iframe")}
        onClick={getIframeData}
        tabIndex={-1}
      >
        {icon && <Utility.IconComposer icon={icon} size={size} />}
      </Styled.Button>
      {confirmation && <Dialog.Confirm {...confirmation} />}
    </>
  );
};

export default forwardRef(IframeButton);
