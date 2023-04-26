import React from "react";
import Journal from "./Journal";
import * as Styled from "./styles";

export default function IssueHeader({
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
      <Journal
        titleString={parentTitleString}
        titleHtml={parentTitleHtml}
        subtitle={parentSubtitle}
        parent
      />
      <Styled.Row $padStart>
        <Styled.ChildLink icon="tocLink16" />
        <Styled.ProjectIcon
          mode="small"
          color="outlined"
          borderless
          ariaLabel={false}
        />
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
