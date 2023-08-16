import React, { forwardRef } from "react";
import { useSlate, ReactEditor } from "slate-react";
import Tooltip from "global/components/atomic/Tooltip";
import TooltipContent from "./TooltipContent";
import { hotkeys, labels, descriptions } from "./TooltipContent/content";
import { toggleOrWrapBlock } from "../../../utils/slate/transforms";
import {
  isTextBlockActive,
  isElementActive
} from "../../../utils/slate/getters";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

const getActiveBlock = (editor, opts, name) => {
  const isActive = name === "textBlock" ? isTextBlockActive : isElementActive;
  const active = opts
    .map(o => [o, isActive(editor, o)])
    .reduce((obj, o) => ({ ...obj, [o[0]]: o[1] }), {});
  const activeCount = opts.map(o => isActive(editor, o)).filter(Boolean).length;

  if (activeCount !== 1) return "";
  return Object.keys(active).find(o => active[o]);
};

const BlockSelect = ({ options, name, color, ...rest }, ref) => {
  const editor = useSlate();
  const { selection } = editor ?? {};

  const renderOptions = options.map(o => (
    <option key={o.format} value={o.format} hidden={!o.format}>
      {o.label}
    </option>
  ));

  const active = getActiveBlock(
    editor,
    options.map(o => o.format),
    name
  );

  return (
    <Styled.SelectTooltipWrapper>
      <Styled.SelectWrapper>
        <Styled.Select
          ref={ref}
          {...rest}
          aria-label="Text styles selector"
          data-active={active !== ""}
          $color={color ?? "var(--color-accent-primary)"}
          value={active}
          onChange={e => {
            e.preventDefault();
            if (!selection) return;
            toggleOrWrapBlock(editor, e.target.value);
          }}
          tabIndex={-1}
        >
          {renderOptions}
        </Styled.Select>
        <Styled.SelectIcon icon="disclosureDown24" size={16} />
      </Styled.SelectWrapper>
      <Tooltip
        content={
          active ? (
            <TooltipContent label={labels[active]} hotkeys={hotkeys[active]} />
          ) : (
            <TooltipContent
              label={labels[name]}
              description={descriptions[name]}
            />
          )
        }
        xOffset="0"
        yOffset="43px"
        delay={0}
      >
        <Styled.TooltipIcon>
          <IconComposer icon="info16" size={14} />
        </Styled.TooltipIcon>
      </Tooltip>
    </Styled.SelectTooltipWrapper>
  );
};

export default forwardRef(BlockSelect);
