import React, { forwardRef } from "react";
import { useSlate, ReactEditor } from "slate-react";
import { toggleBlock, isBlockActive } from "./BlockButton";
import Tooltip from "global/components/atomic/Tooltip";
import TooltipContent from "./TooltipContent";
import { hotkeys, labels } from "./TooltipContent/hotkeys";
import * as Styled from "./styles";

const getActiveBlock = editor => {
  const h1 = isBlockActive(editor, "h1");
  const h2 = isBlockActive(editor, "h2");
  const h3 = isBlockActive(editor, "h3");
  const h4 = isBlockActive(editor, "h4");
  const h5 = isBlockActive(editor, "h5");
  const h6 = isBlockActive(editor, "h6");
  const p = isBlockActive(editor, "p");

  const activeCount = [p, h1, h2, h3, h4, h5, h6].filter(Boolean).length;

  if (activeCount > 1) return "";
  if (h1) return "h1";
  if (h2) return "h2";
  if (h3) return "h3";
  if (h4) return "h4";
  if (h5) return "h5";
  if (h6) return "h6";
  return "p";
};

const BlockSelect = ({ options, ...rest }, ref) => {
  const editor = useSlate();
  const { selection } = editor ?? {};

  const renderOptions = options.map(o => (
    <option key={o.format} value={o.format} hidden={!o.format}>
      {o.label}
    </option>
  ));

  const active = getActiveBlock(editor);

  return (
    <Tooltip
      content={
        <TooltipContent label={labels[active]} hotkeys={hotkeys[active]} />
      }
      xOffset="-75px"
      yOffset="43px"
      delay={0.5}
    >
      <Styled.SelectWrapper>
        <Styled.Select
          ref={ref}
          {...rest}
          aria-label="Text styles selector"
          data-active={active !== "p" && active !== ""}
          value={active}
          onChange={e => {
            e.preventDefault();
            if (!selection) return;
            toggleBlock(editor, e.target.value);
          }}
          tabIndex={-1}
        >
          {renderOptions}
        </Styled.Select>
        <Styled.SelectIcon icon="disclosureDown24" size={16} />
      </Styled.SelectWrapper>
    </Tooltip>
  );
};

export default forwardRef(BlockSelect);
