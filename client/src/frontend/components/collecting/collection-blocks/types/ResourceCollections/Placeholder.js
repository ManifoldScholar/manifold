import React from "react";
import IconComposer from "global/components/utility/IconComposer";
import Skeleton from "frontend/components/collecting/ContentSkeleton";
import * as Styled from "frontend/components/resource-collection/Cover/styles";

function Placeholder() {
  return (
    <>
      <Styled.Cover as="div" $isPlaceholder aria-hidden>
        <Styled.TitleOverlay>
          <Styled.Title>
            <Skeleton nested style={{ height: 20, maxWidth: 200 }} />
          </Styled.Title>
          <Styled.IconWrapper>
            <IconComposer size={48} icon="resourceCollection64" />
            <Styled.IconText>{"Collection"}</Styled.IconText>
          </Styled.IconWrapper>
        </Styled.TitleOverlay>
      </Styled.Cover>
      <span className="screen-reader-text">Loading</span>
    </>
  );
}

Placeholder.className = "Collecting.ResourceCollectionPlaceholder";

export default Placeholder;
