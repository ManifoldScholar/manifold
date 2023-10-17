import React, { forwardRef } from "react";
import { useSlate, ReactEditor } from "slate-react";
import { useTranslation } from "react-i18next";
import Tooltip from "global/components/atomic/Tooltip";
import TooltipContent from "./TooltipContent";
import { toggleOrWrapNode } from "../../../utils/slate/transforms";
import { isElementActive } from "../../../utils/slate/getters";
import * as Styled from "./styles";

const SpanButton = ({ format, ...rest }, ref) => {
  const editor = useSlate();
  const { selection } = editor ?? {};

  const { t } = useTranslation();

  return (
    <Tooltip
      content={
        <TooltipContent
          label={t(`editor.tooltips.labels.span`)}
          description={t(`editor.tooltips.descriptions.span`)}
        />
      }
      xOffset="-75px"
      yOffset="43px"
      delay={0.5}
    >
      <Styled.SpanButton
        as="button"
        ref={ref}
        {...rest}
        aria-label={t("editor.controls.labels.span")}
        data-active={isElementActive(editor, format)[0]}
        onClick={event => {
          event.preventDefault();
          if (!selection) return;
          toggleOrWrapNode(editor, format);
        }}
        tabIndex={-1}
      >
        Span
      </Styled.SpanButton>
    </Tooltip>
  );
};

export default forwardRef(SpanButton);
