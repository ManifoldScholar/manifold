import React from "react";
import Skeleton from "frontend/components/collecting/ContentSkeleton";
import * as Styled from "frontend/components/toc/Node/styles";

function Placeholder() {
  return (
    <>
      <Styled.Link as="div" aria-hidden>
        <Skeleton style={{ maxWidth: 500 }} />
      </Styled.Link>
      <span className="screen-reader-text">Loading</span>
    </>
  );
}

Placeholder.className = "Collecting.TextSectionPlaceholder";

export default Placeholder;
