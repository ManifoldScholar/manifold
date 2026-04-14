import React from "react";
import Project from "./Project";
import Utility from "../utility";
import * as Styled from "./styles";

export default function ResourceHeader({
  titleHtml,
  titleString,
  subtitle,
  parentTitleHtml,
  parentTitleString,
  parentSubtitle,
  parentId,
  actions,
  note,
  hasSecondaryNav,
  icon
}) {
  return (
    <>
      <Project
        titleString={parentTitleString}
        titleHtml={parentTitleHtml}
        subtitle={parentSubtitle}
        id={parentId}
        parent
      />
      <Styled.Row $padStart>
        <Styled.ChildLink icon="tocLink16" />
        <Styled.TextIcon icon={icon} size={36} />
        <Styled.TitleWrapper>
          <Styled.Title {...titleHtml}>{titleString}</Styled.Title>
          {subtitle && <Styled.Subtitle>{subtitle}</Styled.Subtitle>}
        </Styled.TitleWrapper>
      </Styled.Row>
      <Utility
        actions={actions}
        entityType="text"
        childType="text"
        hasSecondaryNav={hasSecondaryNav}
        note={note}
      />
    </>
  );
}
