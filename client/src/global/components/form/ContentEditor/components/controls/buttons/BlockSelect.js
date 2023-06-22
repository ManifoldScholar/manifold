import React, { forwardRef } from "react";
import { useSlate, ReactEditor } from "slate-react";
import Tooltip from "global/components/atomic/Tooltip";
import TooltipContent from "./TooltipContent";
import { hotkeys, labels } from "./TooltipContent/hotkeys";
import { toggleBlock, isBlockActive } from "../../../utils/slate";
import * as Styled from "./styles";

const getActiveBlock = (editor, opts) => {
  const active = opts
    .map(o => [o, isBlockActive(editor, o)])
    .reduce((obj, o) => ({ ...obj, [o[0]]: o[1] }), {});
  const activeCount = opts.map(o => isBlockActive(editor, o)).filter(Boolean)
    .length;

  if (activeCount !== 1) return "";
  return Object.keys(active).find(o => active[o]);
};

const BlockSelect = ({ options, ...rest }, ref) => {
  const editor = useSlate();
  const { selection } = editor ?? {};

  const renderOptions = options.map(o => (
    <option key={o.format} value={o.format} hidden={!o.format}>
      {o.label}
    </option>
  ));

  const active = getActiveBlock(
    editor,
    options.map(o => o.format)
  );

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
          data-active={active !== ""}
          $color={"var(--color-accent-primary)"}
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
