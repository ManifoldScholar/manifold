import React, { forwardRef } from "react";
import { useSlate, ReactEditor } from "slate-react";
import { useTranslation } from "react-i18next";
import Tooltip from "global/components/atomic/Tooltip";
import TooltipContent from "./TooltipContent";
import { hotkeys } from "./TooltipContent/content";
import { toggleOrWrapNode } from "../../../utils/slate/transforms";
import {
  isTextBlockActive,
  isElementActive
} from "../../../utils/slate/getters";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

const getActiveBlock = (editor, opts, name) => {
  const isActive = name === "textBlock" ? isTextBlockActive : isElementActive;
  const active = opts
    .map(o => [o, isActive(editor, o)].flat())
    .filter(o => o[1])
    .sort((a, b) => a[2].length - b[2].length)
    .pop();

  // I can't decide whether it's better to show as active the lowest block or show nothing as active if the selection is nested in multiple blocks.
  // const activeCount = opts.map(o => isActive(editor, o)).filter(Boolean).length;
  // if (activeCount !== 1) return "";

  return active ? active[0] : "";
};

const BlockSelect = ({ options, name, color, ariaLabel, ...rest }, ref) => {
  const editor = useSlate();
  const { selection } = editor ?? {};

  const { t } = useTranslation();

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
          aria-label={ariaLabel}
          data-active={active !== ""}
          $color={color ?? "var(--color-accent-primary)"}
          value={active}
          onChange={e => {
            e.preventDefault();
            if (!selection) return;
            toggleOrWrapNode(editor, e.target.value);
          }}
          tabIndex={-1}
        >
          {renderOptions}
        </Styled.Select>
        <Styled.SelectIcon icon="disclosureDown24" size={16} />
      </Styled.SelectWrapper>
      <Tooltip
        content={
          active &&
          (name === "textBlock" ||
            active === "blockquote" ||
            active === "pre") ? (
            <TooltipContent
              label={t(`editor.tooltips.labels.${active}`)}
              hotkeys={hotkeys[active]}
            />
          ) : (
            <TooltipContent
              label={t(`editor.tooltips.labels.${name}`)}
              description={t(`editor.tooltips.descriptions.${name}`)}
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
