import React from "react";
import Project from "./Project";
import * as Styled from "./styles";

export default function TextHeader({
  titleHtml,
  titleString,
  subtitle,
  parentTitleHtml,
  parentTitleString,
  parentSubtitle,
  utility,
  note
}) {
  return (
    <>
      <Project
        titleString={parentTitleString}
        titleHtml={parentTitleHtml}
        subtitle={parentSubtitle}
        parent
      />
      <Styled.Row $padStart>
        <Styled.ChildLink icon="tocLink16" />
        <Styled.TextIcon icon="TextsLoosePages64" size={36} />
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
