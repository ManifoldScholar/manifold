import React from "react";
import ChildSelector from "../utility/ChildSelector";
import { useLocation } from "react-router-dom";
import Utility from "../utility";
import { getTextLinks } from "../utility/helpers";
import { NavLink } from "react-router-dom";
import lh from "helpers/linkHandler";
import * as Styled from "./styles";

export default function ProjectHeader({
  titleHtml,
  titleString,
  subtitle,
  parent,
  texts,
  note,
  actions,
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
          <Styled.Title {...titleHtml} {...titleLinkProps} $parent={parent}>
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
          entityType="project"
          childType="text"
          hasSecondaryNav={hasSecondaryNav}
          note={note}
        />
      )}
    </>
  );
}
