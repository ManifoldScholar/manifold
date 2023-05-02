import React from "react";
import classNames from "classnames";
import Utility from "global/components/utility";
import {
  useSlateStatic,
  ReactEditor,
  useFocused,
  useSelected
} from "slate-react";
import { Transforms } from "slate";
import * as Styled from "./styles";

export default function ImageRenderer({ element, children, attributes, as }) {
  const editor = useSlateStatic();
  const focused = useFocused();
  const selected = useSelected();
  const path = ReactEditor.findPath(editor, element);

  const onRemove = e => {
    e.preventDefault();
    Transforms.removeNodes(editor, { at: path });
  };

  const wrapperClassName = classNames({
    "responsive-iframe": as === "iframe"
  });
  const className = element.htmlAttrs?.class ?? undefined;

  return (
    <div {...attributes}>
      {children}
      <div contentEditable={false}>
        <Styled.ImageWrapper className={wrapperClassName}>
          <Styled.Content
            as={as ?? "img"}
            src={element.htmlAttrs.src}
            alt={!as ? element.htmlAttrs.alt : undefined}
            title={as ? element.htmlAttrs.title : undefined}
            $selected={selected && focused}
            className={className}
          />
          <Styled.RemoveButton onClick={onRemove}>
            <Utility.IconComposer icon="delete24" size={20} />
          </Styled.RemoveButton>
        </Styled.ImageWrapper>
      </div>
    </div>
  );
}
