import React from "react";
import Journal from "./Journal";
import ChildSelector from "../ChildSelector";
import { useLocation } from "react-router-dom";
import * as Styled from "./styles";

export default function IssueHeader({
  titleHtml,
  titleString,
  subtitle,
  parentTitleHtml,
  parentTitleString,
  parentSubtitle,
  parentId,
  utility,
  note,
  texts,
  id,
  parent,
  issues
}) {
  const { pathname } = useLocation();

  const textLinks = texts?.length
    ? [
        {
          label: "None",
          active: !parent,
          id: id ?? "none",
          route: parent ? "backendProject" : null
        },
        ...texts?.map(t => ({
          label: t.attributes.titlePlaintext,
          route: "backendTextAnalytics",
          id: t.id,
          active: pathname?.includes(t.id)
        }))
      ]
    : [];

  return (
    <>
      {!parent && (
        <Journal
          titleString={parentTitleString}
          titleHtml={parentTitleHtml}
          subtitle={parentSubtitle}
          issues={issues}
          id={parentId}
          parent
        />
      )}
      <Styled.Row $padStart>
        {!parent && (
          <>
            <Styled.ChildLink icon="tocLink16" />
            <Styled.ProjectIcon
              mode="small"
              color="outlined"
              borderless
              ariaLabel={false}
            />
          </>
        )}
        <Styled.TitleWrapper>
          <Styled.Title {...titleHtml}>{titleString}</Styled.Title>
          {subtitle && <Styled.Subtitle>{subtitle}</Styled.Subtitle>}
        </Styled.TitleWrapper>
        {!!texts?.length && <ChildSelector links={textLinks} entity="text" />}
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
