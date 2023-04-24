import React, { forwardRef, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Transforms, Editor, Element as SlateElement } from "slate";
import { useSlate, ReactEditor } from "slate-react";
import Utility from "global/components/utility";
import Modal from "./insert/Modal";
import { useConfirmation } from "hooks";
import InsertImageForm from "./insert/ImageForm";
import { isBlockActive } from "./BlockButton";
import Tooltip from "global/components/atomic/Tooltip";
import TooltipContent from "./TooltipContent";
import { descriptions, labels } from "./TooltipContent/hotkeys";
import isEmpty from "lodash/isEmpty";
import * as Styled from "./styles";

export const insertImage = (editor, url, alt) => {
  const text = { text: "" };
  const image = {
    type: "img",
    htmlAttrs: { src: url, alt: alt ?? "" },
    children: [text]
  };
  Transforms.insertNodes(editor, image);
  ReactEditor.focus(editor);
};

const ImageButton = ({ icon, size, selection, ...rest }, ref) => {
  const { t } = useTranslation();
  const editor = useSlate();
  const { confirm, confirmation } = useConfirmation();
  const urlRef = useRef(null);
  const altRef = useRef(null);

  const addImage = close => {
    const url = urlRef?.current?.inputElement?.value;
    if (!url) return;
    const alt = altRef?.current?.inputElement?.value;
    close();
    return insertImage(editor, url, alt);
  };

  const updateImage = attrs => close => {
    const url = urlRef?.current?.inputElement?.value ?? attrs.src;
    if (!url) return;
    const alt = altRef?.current?.inputElement?.value;
    close();
    Transforms.setNodes(editor, {
      htmlAttrs: { ...attrs, src: url, alt }
    });
    ReactEditor.focus(editor);
  };

  // Not totally sure why, but we have to perform an actual update to the node tree after closing the modal before returning focus to the editor. It might be a weird interaction between the focus trap's close callbacks and the editor.
  const onModalClose = close => {
    close();
    const [node] = Editor.above(editor, { at: selection.focus.path });
    const val = node?.selection_tracker_ignore ?? false;
    Transforms.setNodes(
      editor,
      { selection_tracker_ignore: !val },
      { at: selection.focus.path.slice(0, -1) }
    );
    ReactEditor.focus(editor);
  };

  const getImageData = e => {
    e.preventDefault();
    if (isEmpty(selection)) return;

    const heading = "Insert Image";
    const form = <InsertImageForm urlRef={urlRef} altRef={altRef} />;
    if (confirm)
      confirm({
        heading,
        icon,
        form,
        callback: addImage,
        closeCallback: onModalClose,
        resolveLabel: t("actions.add")
      });
  };

  const updateImageData = e => {
    e.preventDefault();

    const [[image]] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: n =>
          !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "img"
      })
    );

    const attrs = image?.htmlAttrs ?? {};
    const defaultValues = {
      src: attrs.src,
      alt: attrs.alt
    };

    const heading = "Update Image";
    const form = (
      <InsertImageForm
        defaultValues={defaultValues}
        urlRef={urlRef}
        altRef={altRef}
      />
    );

    if (confirm)
      confirm({
        heading,
        icon,
        form,
        callback: updateImage(attrs),
        closeCallback: onModalClose,
        resolveLabel: t("actions.update")
      });
  };

  const active = isBlockActive(editor, "img");

  return (
    <Tooltip
      content={
        <TooltipContent label={labels.img} description={descriptions.img} />
      }
      xOffset="-75px"
      yOffset="43px"
      delay={1}
    >
      <div>
        <Styled.Button
          ref={ref}
          {...rest}
          aria-label="image"
          data-active={active}
          onClick={active ? updateImageData : getImageData}
          tabIndex={-1}
        >
          {icon && <Utility.IconComposer icon={icon} size={size} />}
        </Styled.Button>
        {confirmation && <Modal {...confirmation} />}
      </div>
    </Tooltip>
  );
};

export default forwardRef(ImageButton);
