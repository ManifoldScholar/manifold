import React from "react";
import Journal from "./Journal";
import ChildSelector from "../utility/ChildSelector";
import { useLocation } from "react-router-dom";
import Utility from "../utility";
import { getTextLinks } from "../utility/helpers";
import { NavLink } from "react-router-dom";
import lh from "helpers/linkHandler";
import * as Styled from "./styles";

export default function IssueHeader({
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
  parent,
  issues,
  hasSecondaryNav,
  id
}) {
  const { pathname } = useLocation();
  const textLinks = getTextLinks({ texts, pathname });

  const titleLinkProps = parent
    ? {
        as: NavLink,
        to: lh.link("backendProject", id)
      }
    : {};

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
          <Styled.Title {...titleHtml} {...titleLinkProps}>
            {titleString}
          </Styled.Title>
          {subtitle && <Styled.Subtitle>{subtitle}</Styled.Subtitle>}
        </Styled.TitleWrapper>
        {textLinks && <ChildSelector links={textLinks} entity="text" />}
      </Styled.Row>
      {!parent && (
        <Utility
          actions={actions}
          links={textLinks}
          entityType="journalIssue"
          childType="text"
          hasSecondaryNav={hasSecondaryNav}
          note={note}
        />
      )}
    </>
  );
}
