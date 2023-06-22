import React from "react";
import { rteElements, inlineNodes } from "../../utils/elements";
import { formatNodeLabel } from "../../utils/slate";
import * as Styled from "./styles";

export default function HtmlLabel({ visible, element }) {
  /* eslint-disable no-nested-ternary */
  const color = rteElements.includes(element.type)
    ? "green"
    : inlineNodes.includes(element.type)
    ? "blue"
    : "yellow";
  return visible ? (
    <Styled.ElementLabel $color={color}>
      {formatNodeLabel(element)}
    </Styled.ElementLabel>
  ) : null;
}
