import React from "react";
import Skeleton from "frontend/components/collecting/ContentSkeleton";
import * as Styled from "global/components/atomic/EntityThumbnail/styles";
import * as StyledMetadata from "global/components/atomic/EntityThumbnail/EntityMetadata/styles";

function Placeholder({ stack }) {
  return (
    <Styled.ItemLink as="div" $stack={stack}>
      <Styled.Cover $stack={stack} aria-hidden>
        <Skeleton style={{ maxWidth: 110 }} />
      </Styled.Cover>
      <StyledMetadata.MetadataWrapper $stack={stack} aria-hidden>
        <StyledMetadata.TitleWrapper>
          <Skeleton style={{ maxWidth: 300 }} />
        </StyledMetadata.TitleWrapper>
        <StyledMetadata.Creators>
          <span>
            <Skeleton style={{ width: "75%", maxWidth: 250 }} />
          </span>
        </StyledMetadata.Creators>
        <StyledMetadata.Date>
          <Skeleton style={{ maxWidth: 75 }} />
        </StyledMetadata.Date>
      </StyledMetadata.MetadataWrapper>
      <span className="screen-reader-text">Loading</span>
    </Styled.ItemLink>
  );
}

Placeholder.className = "Collecting.ProjectPlaceholder";

export default Placeholder;
