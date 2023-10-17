import React, { forwardRef, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Transforms, Editor, Element as SlateElement } from "slate";
import { useSlate, ReactEditor } from "slate-react";
import Utility from "global/components/utility";
import Modal from "./insert/Modal";
import { useConfirmation } from "hooks";
import InsertImageForm from "./insert/ImageForm";
import { isElementActive } from "../../../utils/slate/getters";
import { insertImage } from "../../../utils/slate/transforms";
import Tooltip from "global/components/atomic/Tooltip";
import TooltipContent from "./TooltipContent";
import { hotkeys } from "./TooltipContent/content";
import { onModalClose } from "./utils";
import * as Styled from "./styles";

const ImageButton = ({ icon, size, ...rest }, ref) => {
  const { t } = useTranslation();
  const editor = useSlate();
  const { selection } = editor ?? {};
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

  const getImageData = e => {
    e.preventDefault();
    if (!selection) return;

    const heading = t("editor.forms.image_insert_heading");
    const form = <InsertImageForm urlRef={urlRef} altRef={altRef} />;
    if (confirm)
      confirm({
        heading,
        icon,
        form,
        callback: addImage,
        closeCallback: onModalClose(editor, selection),
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

    const heading = t("editor.forms.image_update_heading");
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
        closeCallback: onModalClose(editor, selection),
        resolveLabel: t("actions.update")
      });
  };

  const [active] = isElementActive(editor, "img");

  return (
    <Tooltip
      content={
        <TooltipContent
          label={t(`editor.tooltips.labels.img`)}
          description={t(`editor.tooltips.descriptions.img`)}
          hotkeys={hotkeys.img}
        />
      }
      xOffset="-75px"
      yOffset="43px"
      delay={0.5}
    >
      <div>
        <Styled.Button
          name="img-modal-trigger"
          ref={ref}
          {...rest}
          aria-label={t("editor.controls.labels.image")}
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
