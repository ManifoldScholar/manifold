import React, { forwardRef } from "react";
import { useSlate, ReactEditor } from "slate-react";
import Tooltip from "global/components/atomic/Tooltip";
import TooltipContent from "./TooltipContent";
import { labels, descriptions } from "./TooltipContent/content";
import { toggleOrWrapNode } from "../../../utils/slate/transforms";
import { isElementActive } from "../../../utils/slate/getters";
import * as Styled from "./styles";

const SpanButton = ({ format, ...rest }, ref) => {
  const editor = useSlate();
  const { selection } = editor ?? {};

  return (
    <Tooltip
      content={
        <TooltipContent label={labels.span} description={descriptions.span} />
      }
      xOffset="-75px"
      yOffset="43px"
      delay={0.5}
    >
      <Styled.SpanButton
        as="button"
        ref={ref}
        {...rest}
        aria-label="Insert span element"
        data-active={isElementActive(editor, format)}
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
