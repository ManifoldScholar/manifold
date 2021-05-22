import React from "react";
import ContentPlaceholder from "global/components/ContentPlaceholder";

function Filtered() {
  return (
    <ContentPlaceholder.Wrapper context="frontend">
      <ContentPlaceholder.Title icon="readingGroup24">
        No annotations matched your search criteria.
      </ContentPlaceholder.Title>
      <ContentPlaceholder.Body>
        <p>
          Try removing the text or member filter above to see more annotations.
        </p>
      </ContentPlaceholder.Body>
      <ContentPlaceholder.Actions />
    </ContentPlaceholder.Wrapper>
  );
}

Filtered.displayName = "Annotation.List.Placeholder.Filtered";

export default Filtered;
