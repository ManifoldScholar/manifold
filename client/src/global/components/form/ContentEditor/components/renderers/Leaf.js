import React from "react";
import { useHtmlBreadcrumbs } from "../../contexts/htmlBreadcrumbsContext";
import HtmlLabel from "./HtmlLabel";
import { getHtmlOutlineStyles } from "./styles";

export default function SlateLeaf({ attributes, children, leaf, darkMode }) {
  const { selectedCrumb } = useHtmlBreadcrumbs();
  const showHtml = selectedCrumb === "all";

  let leafChildren = children;

  if (leaf.bold) {
    leafChildren = (
      <strong
        style={showHtml ? getHtmlOutlineStyles("strong", darkMode) : undefined}
      >
        {leafChildren}
        <HtmlLabel element={{ type: "strong" }} visible={showHtml} />
      </strong>
    );
  }

  if (leaf.italic) {
    leafChildren = (
      <em style={showHtml ? getHtmlOutlineStyles("em", darkMode) : undefined}>
        {leafChildren}
        <HtmlLabel element={{ type: "em" }} visible={showHtml} />
      </em>
    );
  }

  if (leaf.underline) {
    leafChildren = (
      <u style={showHtml ? getHtmlOutlineStyles("u", darkMode) : undefined}>
        {leafChildren}
        <HtmlLabel element={{ type: "u" }} visible={showHtml} />
      </u>
    );
  }

  if (leaf.strikethrough) {
    leafChildren = (
      <s style={showHtml ? getHtmlOutlineStyles("s", darkMode) : undefined}>
        {leafChildren}
        <HtmlLabel element={{ type: "s" }} visible={showHtml} />
      </s>
    );
  }

  if (leaf.code) {
    leafChildren = (
      <code
        style={showHtml ? getHtmlOutlineStyles("code", darkMode) : undefined}
      >
        {leafChildren}
        <HtmlLabel element={{ type: "code" }} visible={showHtml} />
      </code>
    );
  }

  return <span {...attributes}>{leafChildren}</span>;
}
