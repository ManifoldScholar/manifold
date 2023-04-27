import React from "react";
import Issue from "./Issue";
import * as Styled from "./styles";

export default function ArticleHeader({
  titleHtml,
  titleString,
  subtitle,
  parentTitleHtml,
  parentTitleString,
  parentSubtitle,
  parentId,
  utility,
  note,
  texts
}) {
  return (
    <>
      <Issue
        titleString={parentTitleString}
        titleHtml={parentTitleHtml}
        subtitle={parentSubtitle}
        texts={texts}
        id={parentId}
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
