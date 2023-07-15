import React from "react";
import Utility from "../utility";
import * as Styled from "./styles";

export default function ProjectCollectionHeader({
  titleHtml,
  titleString,
  titleComponent,
  subtitle,
  icon,
  actions,
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
      <Utility actions={actions} note={note} entityType="projectCollection" />
    </>
  );
}
