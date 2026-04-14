import React from "react";
import Utility from "../utility";
import * as Styled from "./styles";

export default function BaseHeader({
  titleHtml,
  titleString,
  subtitle,
  icon,
  actions,
  note,
  hasSecondaryNav,
  type
}) {
  return (
    <>
      <Styled.Row $minHeight={!icon}>
        {icon && (
          <Styled.JournalFigure>
            <Styled.Icon icon={icon} />
          </Styled.JournalFigure>
        )}
        <Styled.TitleWrapper>
          <Styled.Title {...titleHtml}>{titleString}</Styled.Title>
          {subtitle && <Styled.Subtitle>{subtitle}</Styled.Subtitle>}
        </Styled.TitleWrapper>
      </Styled.Row>
      <Utility
        actions={actions}
        hasSecondaryNav={hasSecondaryNav}
        note={note}
        entityType={type}
      />
    </>
  );
}
