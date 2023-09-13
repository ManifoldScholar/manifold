import React from "react";
import Utility from "../utility";
import * as Styled from "./styles";

export default function CountHeader({
  titleString,
  subtitle,
  icon,
  count,
  titleTag,
  actions,
  type
}) {
  /* eslint-disable no-nested-ternary */
  return (
    <>
      <Styled.Row $compact>
        {icon && titleTag ? (
          <Styled.CountIconSmall icon={icon} />
        ) : icon ? (
          <Styled.CountIcon icon={icon} />
        ) : null}
        <Styled.Title as={titleTag}>
          {typeof count === "number" && <Styled.Count>{count}</Styled.Count>}
          {titleString}
        </Styled.Title>
        {subtitle && <Styled.Subtitle>{subtitle}</Styled.Subtitle>}
      </Styled.Row>
      <Utility actions={actions} entityType={type} />
    </>
  );
}
