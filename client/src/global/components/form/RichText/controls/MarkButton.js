import React from "react";
import { useSlate } from "slate-react";
import { Editor } from "slate";
import Utility from "global/components/utility";
import * as Styled from "./styles";

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const MarkButton = ({ format, label, icon }) => {
  const editor = useSlate();

  return (
    <Styled.Button
      data-active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {icon && <Utility.IconComposer icon={icon} />}
      {label && label}
    </Styled.Button>
  );
};

export default MarkButton;
