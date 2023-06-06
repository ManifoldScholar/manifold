import React from "react";
import classNames from "classnames";
import Utility from "global/components/utility";
import {
  useSlateStatic,
  ReactEditor,
  useFocused,
  useSelected
} from "slate-react";
import { Transforms, Editor } from "slate";
import * as Styled from "./styles";

export default function ImageRenderer({ element, children, attributes, as }) {
  const editor = useSlateStatic();
  const focused = useFocused();
  const selected = useSelected();
  const path = ReactEditor.findPath(editor, element);

  const onRemove = e => {
    e.preventDefault();

    return Editor.withoutNormalizing(editor, () => {
      Transforms.removeNodes(editor, { at: path });
      Transforms.insertNodes(editor, { type: "p", children: [{ text: "" }] });
    });
  };

  const wrapperClassName = classNames({
    "responsive-iframe": as === "iframe"
  });
  const className = element.htmlAttrs?.class ?? undefined;
  const epubType = element.htmlAttrs?.["data-epub-type"] || undefined;

  return (
    <div
      className={element.htmlAttrs?.inline ? "inline-block" : undefined}
      {...attributes}
    >
      {children}
      <span contentEditable={false}>
        <Styled.ImageWrapper
          className={wrapperClassName}
          data-epub-type={epubType}
        >
          <Styled.Content
            as={as ?? "img"}
            src={element.htmlAttrs.src}
            alt={!as ? element.htmlAttrs.alt : undefined}
            title={as ? element.htmlAttrs.title : undefined}
            $selected={selected && focused}
            className={className}
            width={element.htmlAttrs.width}
            height={element.htmlAttrs.height}
          />
          <Styled.RemoveButton onClick={onRemove}>
            <Utility.IconComposer icon="delete24" size={20} />
          </Styled.RemoveButton>
        </Styled.ImageWrapper>
      </span>
    </div>
  );
}
