import React from "react";
import Skeleton from "frontend/components/collecting/ContentSkeleton";

function Placeholder() {
  return (
    <li className={`toc-block__node`}>
      <div className={`toc-block__link`} aria-hidden>
        <Skeleton style={{ maxWidth: 500 }} />
      </div>
      <span className="screen-reader-text">Loading</span>
    </li>
  );
}

Placeholder.className = "ReadingGroup.Collecting.TextSectionPlaceholder";

export default Placeholder;
