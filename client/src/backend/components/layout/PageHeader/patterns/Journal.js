import React from "react";
import ChildSelector from "../utility/ChildSelector";
import { useLocation } from "react-router-dom";
import Utility from "../utility";
import { getIssueLinks } from "../utility/helpers";
import * as Styled from "./styles";

export default function JournalHeader({
  titleHtml,
  titleString,
  subtitle,
  parent,
  issues,
  note,
  id,
  actions,
  hasSecondaryNav
}) {
  const { pathname } = useLocation();
  const issueLinks = getIssueLinks({ issues, id, pathname });

  return (
    <>
      <Styled.Row $padStart={parent}>
        {!parent && (
          <Styled.JournalFigure>
            <Styled.Icon icon="journals64" />
          </Styled.JournalFigure>
        )}
        <Styled.TitleWrapper>
          <Styled.Title {...titleHtml} $parent={parent}>
            {titleString}
          </Styled.Title>
          {subtitle && <Styled.Subtitle>{subtitle}</Styled.Subtitle>}
        </Styled.TitleWrapper>
        {issueLinks && <ChildSelector links={issueLinks} entity="issue" />}
      </Styled.Row>
      {!parent && (
        <Utility
          actions={actions}
          links={issueLinks}
          entityType="journal"
          childType="issue"
          hasSecondaryNav={hasSecondaryNav}
          note={note}
        />
      )}
    </>
  );
}
