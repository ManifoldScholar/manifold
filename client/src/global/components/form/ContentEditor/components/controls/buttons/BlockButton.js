import React, { forwardRef } from "react";
import { useSlate, ReactEditor } from "slate-react";
import { useTranslation } from "react-i18next";
import Utility from "global/components/utility";
import Tooltip from "global/components/atomic/Tooltip";
import TooltipContent from "./TooltipContent";
import { hotkeys } from "./TooltipContent/content";
import { toggleOrWrapNode } from "../../../utils/slate/transforms";
import { isElementActive } from "../../../utils/slate/getters";
import * as Styled from "./styles";

const BlockButton = ({ format, icon, size, ...rest }, ref) => {
  const editor = useSlate();
  const { selection } = editor ?? {};

  const { t } = useTranslation();

  return (
    <Tooltip
      content={
        <TooltipContent
          label={t(`editor.tooltips.labels.${format}`)}
          hotkeys={hotkeys[format]}
        />
      }
      xOffset="-75px"
      yOffset="43px"
      delay={0.5}
    >
      <Styled.Button
        ref={ref}
        {...rest}
        aria-label={t("editor.controls.labels.format", { format })}
        data-active={isElementActive(editor, format)}
        onClick={event => {
          event.preventDefault();
          if (!selection) return;
          toggleOrWrapNode(editor, format);
        }}
        tabIndex={-1}
      >
        {icon && <Utility.IconComposer icon={icon} size={size} />}
      </Styled.Button>
    </Tooltip>
  );
};

export default forwardRef(BlockButton);
