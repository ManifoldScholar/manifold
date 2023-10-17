import React, { forwardRef, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Transforms, Editor, Element as SlateElement } from "slate";
import { useSlate, ReactEditor } from "slate-react";
import Modal from "./insert/Modal";
import InsertIframeForm from "./insert/IframeForm";
import { useConfirmation } from "hooks";
import Utility from "global/components/utility";
import { isValidUrl } from "../../../utils/helpers";
import Tooltip from "global/components/atomic/Tooltip";
import TooltipContent from "./TooltipContent";
import { hotkeys } from "./TooltipContent/content";
import { onModalClose } from "./utils";
import { insertIframe } from "../../../utils/slate/transforms";
import { isElementActive } from "../../../utils/slate/getters";
import * as Styled from "./styles";

const IframeButton = ({ icon, size, ...rest }, ref) => {
  const editor = useSlate();
  const { selection } = editor ?? {};
  const { confirm, confirmation } = useConfirmation();
  const urlRef = useRef(null);
  const titleRef = useRef(null);
  const { t } = useTranslation();

  const addIframe = close => {
    const url = urlRef?.current?.inputElement?.value;
    if (!url) return;
    const title = titleRef?.current?.inputElement?.value;
    if (!isValidUrl(url)) return;
    close();
    return insertIframe(editor, url, title);
  };

  const updateIframe = attrs => close => {
    const url = urlRef?.current?.inputElement?.value ?? attrs.src;
    if (!url) return;
    const title = titleRef?.current?.inputElement?.value;
    close();
    Transforms.setNodes(editor, {
      htmlAttrs: { ...attrs, src: url, title }
    });
    ReactEditor.focus(editor);
  };

  const getIframeData = e => {
    e.preventDefault();
    if (!selection) return;

    const heading = t("editor.forms.iframe_insert_heading");
    const form = <InsertIframeForm urlRef={urlRef} titleRef={titleRef} />;
    if (confirm)
      confirm({
        heading,
        icon,
        form,
        callback: addIframe,
        closeCallback: onModalClose(editor, selection),
        resolveLabel: t("actions.add")
      });
  };

  const updateIframeData = e => {
    e.preventDefault();

    const [[iframe]] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: n =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          n.type === "iframe"
      })
    );

    const attrs = iframe?.htmlAttrs ?? {};
    const defaultValues = {
      src: attrs.src,
      title: attrs.title
    };

    const heading = t("editor.forms.iframe_update_heading");
    const form = (
      <InsertIframeForm
        defaultValues={defaultValues}
        urlRef={urlRef}
        titleRef={titleRef}
      />
    );

    if (confirm)
      confirm({
        heading,
        icon,
        form,
        callback: updateIframe(attrs),
        closeCallback: onModalClose(editor, selection),
        resolveLabel: t("actions.add")
      });
  };

  const [active] = isElementActive(editor, "iframe");

  return (
    <Tooltip
      content={
        <TooltipContent
          label={t(`editor.tooltips.labels.iframe`)}
          description={t(`editor.tooltips.descriptions.iframe`)}
          hotkeys={hotkeys.iframe}
        />
      }
      xOffset="-75px"
      yOffset="43px"
      delay={0.5}
    >
      <div>
        <Styled.Button
          name="iframe-modal-trigger"
          ref={ref}
          {...rest}
          aria-label={t("editor.controls.labels.iframe")}
          data-active={active}
          onClick={active ? updateIframeData : getIframeData}
          tabIndex={-1}
        >
          {icon && <Utility.IconComposer icon={icon} size={size} />}
        </Styled.Button>
        {confirmation && <Modal {...confirmation} />}
      </div>
    </Tooltip>
  );
};

export default forwardRef(IframeButton);
