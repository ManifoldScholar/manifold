import React from "react";
import * as Styled from "./styles";

export default function BaseHeader({
  titleHtml,
  titleString,
  subtitle,
  icon,
  utility,
  note
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
      {(utility || note) && (
        <Styled.Utility>
          {utility}
          {note && <Styled.Note>{note}</Styled.Note>}
        </Styled.Utility>
      )}
    </>
  );
}
