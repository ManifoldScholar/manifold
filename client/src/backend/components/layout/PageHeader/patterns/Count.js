import React from "react";
import * as Styled from "./styles";

export default function CountHeader({
  titleString,
  subtitle,
  icon,
  count,
  titleTag
}) {
  return (
    <Styled.Row $compact>
      {icon && titleTag ? (
        <Styled.CountIconSmall icon={icon} />
      ) : (
        <Styled.CountIcon icon={icon} />
      )}
      <Styled.Title as={titleTag}>
        <Styled.Count>{count}</Styled.Count>
        {titleString}
      </Styled.Title>
      {subtitle && <Styled.Subtitle>{subtitle}</Styled.Subtitle>}
    </Styled.Row>
  );
}
