import React, { forwardRef } from "react";
import { useSlate, ReactEditor } from "slate-react";
import Utility from "global/components/utility";
import Tooltip from "global/components/atomic/Tooltip";
import TooltipContent from "./TooltipContent";
import { hotkeys, labels } from "./TooltipContent/hotkeys";
import { isMarkActive, toggleMark } from "../../../utils/slate";
import * as Styled from "./styles";

const MarkButton = ({ format, label, icon, isFirst, ...rest }, ref) => {
  const editor = useSlate();
  const { selection } = editor ?? {};

  return (
    <Tooltip
      content={
        <TooltipContent label={labels[format]} hotkeys={hotkeys[format]} />
      }
      xOffset="-75px"
      yOffset="43px"
      delay={0.5}
    >
      <Styled.Button
        ref={ref}
        {...rest}
        aria-label={format}
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
