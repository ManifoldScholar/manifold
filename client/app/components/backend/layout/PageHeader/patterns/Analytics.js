import React from "react";
import * as Styled from "./styles";

export default function AnalyticsHeader({
  titleString,
  titleComponent,
  titleTag,
  link
}) {
  return (
    <Styled.Row $compact>
      <Styled.AnalyticsIcon icon="BEAnalytics64" />
      <Styled.Title as={titleTag}>{titleComponent ?? titleString}</Styled.Title>
      {link && (
        <Styled.SeeAllLink to={link.path} className="utility-button">
          {link.label}
        </Styled.SeeAllLink>
      )}
    </Styled.Row>
  );
}
