import React, { forwardRef, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Range } from "slate";
import { useSlate, ReactEditor } from "slate-react";
import Utility from "global/components/utility";
import InsertLinkForm from "./insert/LinkForm";
import { useConfirmation } from "hooks";
import Modal from "./insert/Modal";
import Tooltip from "global/components/atomic/Tooltip";
import TooltipContent from "./TooltipContent";
import { hotkeys } from "./TooltipContent/content";
import { onModalClose } from "./utils";
import { wrapLink, unwrapLink } from "../../../utils/slate/transforms";
import { isLinkActive } from "../../../utils/slate/getters";

import * as Styled from "./styles";

const LinkButton = ({ icon, size, ...rest }, ref) => {
  const editor = useSlate();
  const active = isLinkActive(editor);
  const { confirm, confirmation } = useConfirmation();
  const urlRef = useRef(null);
  const textRef = useRef(null);
  const { t } = useTranslation();

  const addLink = close => {
    const url = urlRef?.current?.inputElement?.value;
    const text = textRef?.current?.inputElement?.value;
    if (!url) return;
    close();
    wrapLink(editor, url, text);
  };

  const getLinkData = e => {
    e.preventDefault();
    const { selection } = editor ?? {};
    if (!selection) return;

    if (active) return unwrapLink(editor);

    const heading = t("editor.forms.link_insert_heading");

    const isCollapsed = Range.isCollapsed(selection);
    const defaultValues = !isCollapsed
      ? { text: Editor.string(editor, selection) }
      : {};

    const form = (
      <InsertLinkForm
        urlRef={urlRef}
        textRef={textRef}
        defaultValues={defaultValues}
      />
    );
    if (confirm)
      confirm({
        heading,
        icon,
        form,
        callback: addLink,
        closeCallback: onModalClose(editor, selection),
        resolveLabel: t("actions.add")
      });
  };

  return (
    <Tooltip
      content={
        <TooltipContent
          label={t(`editor.tooltips.labels.link`)}
          hotkeys={hotkeys.link}
        />
      }
      xOffset="-75px"
      yOffset="43px"
      delay={0.5}
    >
      <Styled.Button
        name="link-modal-trigger"
        ref={ref}
        {...rest}
        aria-label={t("editor.controls.labels.link")}
        data-active={active}
        onClick={getLinkData}
        tabIndex={-1}
      >
        {icon && <Utility.IconComposer icon={icon} size={size} />}
        {confirmation && <Modal {...confirmation} />}
      </Styled.Button>
    </Tooltip>
  );
};

export default forwardRef(LinkButton);
