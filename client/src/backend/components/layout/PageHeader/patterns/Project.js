import React from "react";
import ChildSelector from "../ChildSelector";
import { useLocation } from "react-router-dom";
import * as Styled from "./styles";

export default function ProjectHeader({
  titleHtml,
  titleString,
  subtitle,
  parent,
  texts,
  utility,
  note,
  id
}) {
  const { pathname } = useLocation();

  const textLinks = texts
    ? [
        {
          label: "None",
          active: !parent,
          id: id ?? "none",
          route: parent ? "backendProject" : null
        },
        ...texts?.map(t => ({
          label: t.label,
          route: "backendTextAnalytics",
          id: t.id,
          active: pathname?.includes(t.id)
        }))
      ]
    : [];

  return (
    <>
      <Styled.Row $padStart={parent}>
        {!parent && (
          <Styled.Figure>
            <Styled.ProjectIcon
              mode="small"
              color="outlined"
              borderless
              ariaLabel={false}
            />
          </Styled.Figure>
        )}
        <Styled.TitleWrapper>
          <Styled.Title {...titleHtml} $parent={parent}>
            {titleString}
          </Styled.Title>
          {subtitle && <Styled.Subtitle>{subtitle}</Styled.Subtitle>}
        </Styled.TitleWrapper>
        {texts && <ChildSelector links={textLinks} entity="text" />}
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
