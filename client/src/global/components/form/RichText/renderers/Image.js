import React from "react";
import Utility from "global/components/utility";
import { useSlateStatic, ReactEditor } from "slate-react";
import { Transforms } from "slate";
import * as Styled from "./styles";

export default function ImageRenderer({ element, children, attributes }) {
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, element);

  const onRemove = e => {
    e.preventDefault();
    Transforms.removeNodes(editor, { at: path });
  };

  return (
    <span {...attributes}>
      {children}
      <Styled.ImageWrapper contentEditable={false}>
        <Styled.Image src={element.htmlAttrs.src} alt={element.htmlAttrs.alt} />
        <Styled.RemoveButton onClick={onRemove}>
          <Utility.IconComposer icon="delete24" size={20} />
        </Styled.RemoveButton>
      </Styled.ImageWrapper>
    </span>
  );
}
