import React, { forwardRef } from "react";
import { useSlate, ReactEditor } from "slate-react";
import { Editor, Element as SlateElement, Transforms, Range } from "slate";
import Utility from "global/components/utility";
import Tooltip from "global/components/atomic/Tooltip";
import TooltipContent from "./TooltipContent";
import { hotkeys, labels } from "./TooltipContent/hotkeys";
import * as Styled from "./styles";

const LIST_TYPES = ["ol", "ul"];

export const isBlockActive = (editor, format, blockType = "type") => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format &&
        !n.nodeName
    })
  );

  return !!match;
};

/* eslint-disable no-nested-ternary */
export const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type),
    split: true
  });

  const newProperties = {
    type: isActive ? "p" : isList ? "li" : format
  };

  if (Range.isCollapsed(editor.selection)) {
    Transforms.setNodes(editor, newProperties);
  } else {
    Transforms.setNodes(editor, newProperties, editor.selection.anchor);
  }

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }

  if (format === "pre") Editor.addMark(editor, "code", true);

  ReactEditor.focus(editor);
};

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
          toggleBlock(editor, format);
        }}
        tabIndex={-1}
      >
        {icon && <Utility.IconComposer icon={icon} size={size} />}
      </Styled.Button>
    </Tooltip>
  );
};

export default forwardRef(BlockButton);
