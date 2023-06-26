import React, { forwardRef } from "react";
import { useSlate, ReactEditor } from "slate-react";
import Utility from "global/components/utility";
import Tooltip from "global/components/atomic/Tooltip";
import TooltipContent from "./TooltipContent";
import { hotkeys, labels } from "./TooltipContent/hotkeys";
import { toggleOrWrapBlock } from "../../../utils/slate/transforms";
import { isBlockActive } from "../../../utils/slate/getters";
import * as Styled from "./styles";

const BlockButton = ({ format, icon, size, ...rest }, ref) => {
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
        data-active={isBlockActive(editor, format)}
        onClick={event => {
          event.preventDefault();
          if (!selection) return;
          toggleOrWrapBlock(editor, format);
        }}
        tabIndex={-1}
      >
        {icon && <Utility.IconComposer icon={icon} size={size} />}
      </Styled.Button>
    </Tooltip>
  );
};

export default forwardRef(BlockButton);
