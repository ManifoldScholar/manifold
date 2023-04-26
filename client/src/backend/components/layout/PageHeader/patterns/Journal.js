import React from "react";
import * as Styled from "./styles";

export default function JournalHeader({
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
        {childEntities && (
          <Styled.Dropdown>
            <span>Show Issue</span>
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
