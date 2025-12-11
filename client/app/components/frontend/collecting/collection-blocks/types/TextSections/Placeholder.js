import React from "react";
import Skeleton from "components/frontend/collecting/ContentSkeleton";
import * as Styled from "components/frontend/toc/Node/styles";

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
