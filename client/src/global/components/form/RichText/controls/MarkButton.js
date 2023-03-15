import React from "react";
import { useSlate, ReactEditor } from "slate-react";
import { Editor, Transforms } from "slate";
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

const MarkButton = ({ format, label, icon, selection }) => {
  const editor = useSlate();

  return (
    <Styled.Button
      aria-label={format}
      data-active={isMarkActive(editor, format)}
      onClick={event => {
        event.preventDefault();
        Transforms.select(editor, selection);
        toggleMark(editor, format);
        ReactEditor.focus(editor);
      }}
    >
      {icon && <Utility.IconComposer icon={icon} />}
      {label && label}
    </Styled.Button>
  );
};

export default MarkButton;
