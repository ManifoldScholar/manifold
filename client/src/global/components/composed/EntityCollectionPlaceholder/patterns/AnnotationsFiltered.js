import React from "react";
import { Actions, Body, Title, Wrapper } from "../parts";

function FilteredAnnotationsPlaceholder({ style }) {
  return (
    <Wrapper context="frontend" style={style}>
      <Title icon="readingGroup24">
        No annotations matched your search criteria.
      </Title>
      <Body>
        <p>
          Try removing the text or member filter above to see more annotations.
        </p>
      </Body>
      <Actions />
    </Wrapper>
  );
}

FilteredAnnotationsPlaceholder.displayName =
  "Global.Composed.EntityCollectionPlaceholder.FilteredAnnotations";

export default FilteredAnnotationsPlaceholder;
