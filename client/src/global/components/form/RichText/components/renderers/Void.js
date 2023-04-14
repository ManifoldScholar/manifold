import React, { useRef } from "react";
import { ReactEditor } from "slate-react";
import * as Styled from "./styles";

export default function ImageRenderer({
  element,
  children,
  attributes,
  styleTag
}) {
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
    <Styled.VoidWrapper
      contentEditable={false}
      className={className}
      {...attributes}
    >
      <Styled.Void
        as={"iframe"}
        ref={iframeRef}
        srcDoc={srcDoc}
        title={"element not editable"}
        onLoad={onLoad}
      />
      {children}
    </Styled.VoidWrapper>
  );
}
