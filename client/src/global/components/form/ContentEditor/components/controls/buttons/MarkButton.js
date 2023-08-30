import React, { forwardRef } from "react";
import { useSlate, ReactEditor } from "slate-react";
import { useTranslation } from "react-i18next";
import Utility from "global/components/utility";
import Tooltip from "global/components/atomic/Tooltip";
import TooltipContent from "./TooltipContent";
import { hotkeys } from "./TooltipContent/content";
import { toggleMark } from "../../../utils/slate/transforms";
import { isMarkActive } from "../../../utils/slate/getters";
import * as Styled from "./styles";

const MarkButton = ({ format, label, icon, isFirst, ...rest }, ref) => {
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
        data-active={isMarkActive(editor, format)}
        onClick={event => {
          event.preventDefault();
          if (!selection) return;
          toggleMark(editor, format);
        }}
        tabIndex={isFirst ? 0 : -1}
      >
        {icon && <Utility.IconComposer icon={icon} />}
        {label && label}
      </Styled.Button>
    </Tooltip>
  );
};

export default forwardRef(MarkButton);
