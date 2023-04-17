import React, { useRef } from "react";
import { ReactEditor, useFocused, useSelected } from "slate-react";
import * as Styled from "./styles";

export default function ImageRenderer({
  element,
  children,
  attributes,
  styleTag
}) {
  const focused = useFocused();
  const selected = useSelected();

  const className = element.htmlAttrs?.class || undefined;

  const addStyleTag = html => {
    const [, rest] = html.split("<html>");
    return `<html>${styleTag}${rest}`;
  };

  const { srcdoc } = element.htmlAttrs ?? {};

  const srcDoc = srcdoc ? addStyleTag(srcdoc) : undefined;

  const iframeRef = useRef(null);

  const onLoad = () => {
    const contentHeight =
      iframeRef.current.contentWindow.document.body.scrollHeight;
    const height = contentHeight > 48 ? contentHeight + 44 : 48;
    iframeRef.current.height = `${height}px`;
  };

  return (
    <div {...attributes}>
      {children}
      <Styled.VoidWrapper contentEditable={false} className={className}>
        <Styled.Void
          ref={iframeRef}
          srcDoc={srcDoc}
          title={"element not editable"}
          onLoad={onLoad}
          $selected={selected && focused}
        />
      </Styled.VoidWrapper>
    </div>
  );
}
