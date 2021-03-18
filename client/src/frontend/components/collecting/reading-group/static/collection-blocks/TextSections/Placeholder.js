import React from "react";
import Skeleton from "../ContentSkeleton";

function Placeholder() {
  return (
    <li className={`toc-block__node`} aria-hidden>
      <div className={`toc-block__link`}>
        <Skeleton style={{ maxWidth: 500 }} />
      </div>
    </li>
  );
}

Placeholder.className = "ReadingGroup.Collecting.TextSectionPlaceholder";

export default Placeholder;
