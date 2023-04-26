import React from "react";
import * as Styled from "./styles";

export default function ProjectCollectionHeader({
  titleHtml,
  titleString,
  titleComponent,
  subtitle,
  icon,
  utility,
  note
}) {
  return (
    <>
      <Styled.Row>
        {titleComponent ?? (
          <>
            <Styled.ProjectCollectionFigure>
              <Styled.ProjectCollectionIcon icon={icon} />
            </Styled.ProjectCollectionFigure>
            <Styled.TitleWrapper>
              <Styled.Title {...titleHtml}>{titleString}</Styled.Title>
              {subtitle && <Styled.Subtitle>{subtitle}</Styled.Subtitle>}
            </Styled.TitleWrapper>
          </>
        )}
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
