import React from "react";
import { useSlate } from "slate-react";
import { Editor, Element as SlateElement, Transforms } from "slate";
import Utility from "global/components/utility";
import * as Styled from "./styles";

const LIST_TYPES = ["ol", "ul"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

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
const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true
  });
  let newProperties;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format
    };
  } else {
    newProperties = {
      type: isActive ? "p" : isList ? "li" : format
    };
  }
  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const BlockButton = ({ format, icon }) => {
  const editor = useSlate();

  return (
    <Styled.Button
      data-active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
      )}
      onMouseDown={event => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {icon && <Utility.IconComposer icon={icon} />}
    </Styled.Button>
  );
};

export default BlockButton;
