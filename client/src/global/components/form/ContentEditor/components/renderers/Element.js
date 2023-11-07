import React from "react";
import Image from "./Image";
import Void from "./Void";
import HtmlLabel from "./HtmlLabel";
import {
  rteElements,
  renderedElements,
  markElements,
  nestableElements
} from "../../utils/elements";
import classNames from "classnames";
import * as Styled from "./styles";
import { getHtmlOutlineStyles } from "./styles";
import { useSlateStatic, ReactEditor } from "slate-react";
import { useHtmlBreadcrumbs } from "../../contexts/htmlBreadcrumbsContext";

export default function SlateElement({
  attributes,
  children,
  element,
  theme,
  darkMode
}) {
  const className = element.htmlAttrs?.class || undefined;
  const epubType = element.htmlAttrs?.["data-epub-type"] || undefined;

  const editor = useSlateStatic();
  const { id } = ReactEditor.findKey(editor, element);
  const { selectedCrumb } = useHtmlBreadcrumbs();
  const showHtml =
    (selectedCrumb === id || selectedCrumb === "all") && !element.slateOnly;

  if (element.type === "br") {
    return (
      <p
        {...attributes}
        style={showHtml ? getHtmlOutlineStyles("p", darkMode) : undefined}
      >
        {children}
        <HtmlLabel element={element} visible={showHtml} />
      </p>
    );
  }
  if (element.type === "hr") {
    return (
      <Styled.HrOuter contentEditable={false} {...attributes}>
        {children}
        <Styled.HrInner>
          <hr
            className={className}
            data-epub-type={epubType}
            style={showHtml ? getHtmlOutlineStyles("hr", darkMode) : undefined}
          />
        </Styled.HrInner>
        <HtmlLabel element={element} visible={showHtml} />
      </Styled.HrOuter>
    );
  }
  if (element.type === "void") {
    return (
      <Void
        attributes={attributes}
        element={element}
        theme={theme}
        darkMode={darkMode}
        showHtml={showHtml}
      >
        {children}
      </Void>
    );
  }
  if (element.type === "img") {
    return (
      <Image
        attributes={attributes}
        element={element}
        showHtml={showHtml}
        darkMode={darkMode}
      >
        {children}
      </Image>
    );
  }
  if (element.type === "iframe" || element.type === "video") {
    return (
      <Image
        as={element.type}
        attributes={attributes}
        element={element}
        showHtml={showHtml}
        darkMode={darkMode}
      >
        {children}
      </Image>
    );
  }
  if (element.type === "a") {
    return (
      <a
        className={className}
        data-epub-type={epubType}
        href={element.htmlAttrs?.href}
        {...attributes}
        style={showHtml ? getHtmlOutlineStyles("a", darkMode) : undefined}
      >
        {children}
        <HtmlLabel element={element} visible={showHtml} />
      </a>
    );
  }
  if (element.type === "pre") {
    return (
      <pre
        className={className}
        data-epub-type={epubType}
        {...attributes}
        style={showHtml ? getHtmlOutlineStyles("pre", darkMode) : undefined}
      >
        <code>{children}</code>
        <HtmlLabel element={element} visible={showHtml} />
      </pre>
    );
  }
  if (element.type === "div" && element.inline) {
    return (
      <div
        className={classNames("inline-block", className)}
        data-epub-type={epubType}
        {...attributes}
      >
        {children}
      </div>
    );
  }
  if (
    rteElements.includes(element.type) ||
    renderedElements.includes(element.type) ||
    markElements.includes(element.type) ||
    nestableElements.includes(element.type) ||
    element.type === "span"
  ) {
    const Tag = element.type === "list-sibling" ? "span" : element.type;
    return (
      <Tag
        className={className}
        data-epub-type={epubType}
        {...attributes}
        style={showHtml ? getHtmlOutlineStyles(Tag, darkMode) : undefined}
      >
        {children}
        <HtmlLabel element={element} visible={showHtml} />
      </Tag>
    );
  }

  return null;
}
