import React from "react";
import * as Styled from "./styles";

export default function ProjectHeader({
  titleHtml,
  titleString,
  subtitle,
  parent,
  childEntities,
  utility,
  note
}) {
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
        {childEntities && (
          <Styled.Dropdown>
            <span>Show Text</span>
            <Styled.DropdownIcon icon="disclosureDown24" size={22} />
          </Styled.Dropdown>
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
