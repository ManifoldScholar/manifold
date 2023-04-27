import React from "react";
import ChildSelector from "../ChildSelector";
import { useLocation } from "react-router-dom";
import * as Styled from "./styles";

export default function JournalHeader({
  titleHtml,
  titleString,
  subtitle,
  parent,
  issues,
  utility,
  note,
  id
}) {
  const { pathname } = useLocation();

  const issueLinks = issues
    ? [
        {
          label: "None",
          active: !parent,
          id: id ?? "none",
          route: parent ? "backendJournal" : null
        },
        ...issues?.map(i => ({
          label: i.title,
          route: "backendProjectAnalytics",
          id: i.id,
          active: pathname?.includes(i.id)
        }))
      ]
    : [];

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
        {!!issues?.length && (
          <ChildSelector links={issueLinks} entity="issue" />
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
