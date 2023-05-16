import React, { forwardRef } from "react";
import { useSlate, ReactEditor } from "slate-react";
import { Editor, Node } from "slate";
import Utility from "global/components/utility";
import Tooltip from "global/components/atomic/Tooltip";
import TooltipContent from "./TooltipContent";
import { hotkeys, labels } from "./TooltipContent/hotkeys";
import * as Styled from "./styles";

const isMarkActive = (editor, format) => {
  if (!editor.selection) return false;
  const node = Node.get(editor, editor.selection.focus.path);
  const marks = node.text ? Editor.marks(editor) : false;

  if (format === "code") {
    const [pre] = Editor.above(editor, { match: n => n.type === "pre" }) ?? [];
    if (pre) return false;
  }
  return marks ? marks[format] === true : false;
};

export const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }

  ReactEditor.focus(editor);
};

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
