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
import {
  handleImageHotkey,
  handleIframeHotkey
} from "../../transforms/handlers";
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
      Transforms.insertNodes(
        editor,
        { type: "p", children: [{ text: "" }] },
        { select: true }
      );
    });
  };

  const wrapperClassName = classNames({
    "responsive-iframe": as === "iframe"
  });

  const { htmlAttrs } = element ?? {};
  const className = htmlAttrs?.class ?? undefined;
  const epubType = htmlAttrs?.["data-epub-type"] || undefined;

  return (
    <div
      className={htmlAttrs?.inline ? "inline-block" : undefined}
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
            src={htmlAttrs.src}
            alt={!as ? htmlAttrs.alt : undefined}
            title={as ? htmlAttrs.title : undefined}
            $selected={selected && focused}
            className={className}
            width={htmlAttrs?.width}
            height={htmlAttrs?.height}
          />
          <Styled.ButtonGroup $visible={selected}>
            <Styled.InteriorButton
              onClick={as === "iframe" ? handleIframeHotkey : handleImageHotkey}
            >
              <Utility.IconComposer icon="annotate24" size={24} />
            </Styled.InteriorButton>
            <Styled.InteriorButton $color="red" onClick={onRemove}>
              <Utility.IconComposer icon="delete24" size={24} />
            </Styled.InteriorButton>
          </Styled.ButtonGroup>
        </Styled.ImageWrapper>
      </span>
    </div>
  );
}
