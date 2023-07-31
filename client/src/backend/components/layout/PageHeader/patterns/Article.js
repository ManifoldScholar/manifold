import React from "react";
import { useLocation } from "react-router-dom";
import Issue from "./Issue";
import Utility from "../utility";
import { getTextLinks } from "../utility/helpers";
import * as Styled from "./styles";

export default function ArticleHeader({
  titleHtml,
  titleString,
  subtitle,
  parentTitleHtml,
  parentTitleString,
  parentSubtitle,
  parentId,
  actions,
  note,
  texts,
  hasSecondaryNav
}) {
  const { pathname } = useLocation();
  const textLinks = getTextLinks({
    texts,
    pathname
  });

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
      <Utility
        actions={actions}
        links={textLinks}
        entityType="text"
        childType="text"
        hasSecondaryNav={hasSecondaryNav}
        note={note}
      />
    </>
  );
}
