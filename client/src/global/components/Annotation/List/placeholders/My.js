import React from "react";
import ContentPlaceholder from "global/components/ContentPlaceholder";

function My() {
  return (
    <ContentPlaceholder.Wrapper context="frontend">
      <ContentPlaceholder.Title icon="notes24">
        Create your first annotation!
      </ContentPlaceholder.Title>
      <ContentPlaceholder.Body>
        <p>
          While reading, add your notes and annotations to the text. Save them
          privately, or associate them with a reading group.
        </p>
      </ContentPlaceholder.Body>
      <ContentPlaceholder.Actions />
    </ContentPlaceholder.Wrapper>
  );
}

My.displayName = "Annotation.List.Placeholder.My";

export default My;
