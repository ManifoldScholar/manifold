// This file still has a lot of copied code. Needs to be revised.

import React from "react";
import { useSlate, ReactEditor } from "slate-react";
import { Editor, Element as SlateElement, Transforms, Range } from "slate";
import Utility from "global/components/utility";
import * as Styled from "./styles";

const LIST_TYPES = ["ol", "ul"];

const isBlockActive = (editor, format, blockType = "type") => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format
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
};

const BlockButton = ({ format, icon, size, selection }) => {
  const editor = useSlate();

  return (
    <Styled.Button
      aria-label={format}
      data-active={isBlockActive(editor, format)}
      onClick={event => {
        event.preventDefault();
        Transforms.select(editor, selection);
        toggleBlock(editor, format);
        ReactEditor.focus(editor);
      }}
    >
      {icon && <Utility.IconComposer icon={icon} size={size} />}
    </Styled.Button>
  );
};

export default BlockButton;
